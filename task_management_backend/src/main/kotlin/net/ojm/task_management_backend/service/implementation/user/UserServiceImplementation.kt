package net.ojm.task_management_backend.service.implementation.user

import jakarta.persistence.EntityNotFoundException
import net.ojm.task_management_backend.domain.dto.user.request.UserUpdatePasswordRequest
import net.ojm.task_management_backend.domain.dto.user.request.UserUpdateRequest
import net.ojm.task_management_backend.extensions.user.toUserUpdateResponse
import net.ojm.task_management_backend.repo.user.UserRepo
import net.ojm.task_management_backend.service.services.user.UserService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserServiceImplementation(
    private val userRepo: UserRepo,
    private val passwordEncoder: PasswordEncoder,
): UserService {
    override fun updateUser(request: UserUpdateRequest): Any {
        val user = userRepo.findById(request.userId)
            .orElseThrow { EntityNotFoundException("User with id ${request.userId} not found") }

        // Create a new user object with updated fields
        val updatedUser = user.copy(
            name = request.name ?: user.name
        )

        userRepo.save(updatedUser)
        return updatedUser.toUserUpdateResponse()
    }

    override fun updatePassword(request: UserUpdatePasswordRequest): Any {
        val user = userRepo.findById(request.userId)
            .orElseThrow { EntityNotFoundException("User with id ${request.userId} not found") }

        if (!passwordEncoder.matches(request.currentPassword, user.userPassword)) {
            throw IllegalArgumentException("Current password is incorrect")
        }
        if (passwordEncoder.matches(request.newPassword, user.userPassword)) {
            throw IllegalArgumentException("New password cannot be the same as current password")
        }
        val updatedUser = user.copy(userPassword = passwordEncoder.encode(request.newPassword))
        userRepo.save(updatedUser)
        return "Password updated successfully"
    }
}