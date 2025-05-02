package net.ojm.task_management_backend.controller.auth

import net.ojm.task_management_backend.domain.dto.auth.request.LoginRequest
import net.ojm.task_management_backend.domain.dto.auth.request.RegisterRequest
import net.ojm.task_management_backend.domain.dto.organisation.request.OrganisationRegisterRequest
import net.ojm.task_management_backend.service.services.auth.AuthService
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
@RestController
@RequestMapping("/api/v1/auth")
class AuthController(
    private val authService: AuthService
) {

    @PostMapping("/register-organisation")
    fun register(@RequestBody request: OrganisationRegisterRequest): ResponseEntity<String> {
        return authService.registerOrganisation(request)
    }

    @PostMapping(path = ["/register"])
    fun register(@RequestBody request: RegisterRequest): ResponseEntity<String> {
        return authService.register(request)
    }

    @GetMapping(path = ["/login"])
    fun login(@RequestBody request: LoginRequest): ResponseEntity<Any> {
        return authService.login(request)
    }

}