package net.ojm.task_management_backend.service.implementation.auth

import jakarta.persistence.EntityNotFoundException
import net.ojm.task_management_backend.domain.dto.auth.request.LoginRequest
import net.ojm.task_management_backend.domain.dto.auth.request.RegisterRequest
import net.ojm.task_management_backend.domain.dto.auth.response.LoginResponse
import net.ojm.task_management_backend.domain.dto.organisation.request.OrganisationRegisterRequest
import net.ojm.task_management_backend.domain.entity.user.RoleTypeEnum
import net.ojm.task_management_backend.extensions.auth.toOrganisationEntity
import net.ojm.task_management_backend.extensions.auth.toUserEntity
import net.ojm.task_management_backend.jwt.JwtUtils
import net.ojm.task_management_backend.repo.organisation.OrganisationRepo
import net.ojm.task_management_backend.repo.user.UserRepo
import net.ojm.task_management_backend.service.services.auth.AuthService
import net.ojm.task_management_backend.service.services.user.CustomUserDetails
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.AuthenticationException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthServiceImplementation (
    private val userRepo: UserRepo,
    private val passwordEncoder: PasswordEncoder,
    private val authenticationManager: AuthenticationManager,
    private val jwtUtils: JwtUtils,
    private val organisationRepo: OrganisationRepo,
): AuthService {

    override fun registerOrganisation(request: OrganisationRegisterRequest): ResponseEntity<String> {
        var organisation = request.toOrganisationEntity()

        if (organisationRepo.existsByOrganisationName(organisation.organisationName)) {
            return ResponseEntity.badRequest().body("Organisation name already in use")
        }

        val user = request.toUserEntity(organisation)

        if (userRepo.existsByEmail(user.email)) {
            return ResponseEntity.badRequest().body("Email already in use")
        }

        if (userRepo.existsByUserName(user.userName)) {
            return ResponseEntity.badRequest().body("UserName already in use")
        }

        val encodedPassword = passwordEncoder.encode(user.userPassword)
        organisation = organisationRepo.save(organisation)
        val newUser = user.copy(userPassword = encodedPassword, organisation = organisation)
        userRepo.save(newUser)
        return ResponseEntity.ok("Organisation registered successfully")
    }

    override fun register(request: RegisterRequest): ResponseEntity<String> {
        val organisation = organisationRepo.findByOrganisationName(request.organisationName)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Organisation not found")

        val user = request.toUserEntity(organisation)

        if (userRepo.existsByEmail(user.email)) {
            return ResponseEntity.badRequest().body("Email already in use")
        }
        if (userRepo.existsByUserName(user.userName)) {
            return ResponseEntity.badRequest().body("UserName already in use")
        }
        val encodedPassword = passwordEncoder.encode(user.userPassword)
        val newUser = user.copy(userPassword = encodedPassword)
        userRepo.save(newUser)
        return ResponseEntity.ok("User registered successfully")
    }

    override fun login(request: LoginRequest): ResponseEntity<Any> {
        val organisation = organisationRepo.findByOrganisationName(request.organisationName)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Organisation not found")

        val authentication = try {
            authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken(
                    request.userName,
                    request.userPassword
                )
            )
        } catch (ex: AuthenticationException) {
            val errorBody = mapOf(
                "message" to "Bad credentials",
                "status" to false
            )
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorBody)
        }
        SecurityContextHolder.getContext().authentication = authentication
        val userDetails = authentication.principal as CustomUserDetails

        val jwtToken = jwtUtils.generateTokenFromUsername(userDetails)

        val role = userDetails.authorities.first().authority

        val user = userRepo.findByUserNameAndOrganisation(userDetails.username, organisation)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found in organisation")

        val response = LoginResponse(
            userId = userDetails.getUserId(),
            name = user.name,
            userName = userDetails.getUsername(),
            organisationName = organisation.organisationName,
            organisationId = organisation.organisationId,
            role = role,
            jwtToken = jwtToken
        )

        return ResponseEntity.ok(response)
    }

}