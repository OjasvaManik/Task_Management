package net.ojm.task_management_backend.service.services.auth

import net.ojm.task_management_backend.domain.dto.auth.request.LoginRequest
import net.ojm.task_management_backend.domain.dto.auth.request.RegisterRequest
import net.ojm.task_management_backend.domain.dto.auth.response.LoginResponse
import net.ojm.task_management_backend.domain.dto.organisation.request.OrganisationRegisterRequest
import org.springframework.http.ResponseEntity

interface AuthService {

    fun registerOrganisation(request: OrganisationRegisterRequest): ResponseEntity<String>

    fun register(request: RegisterRequest): ResponseEntity<String>

    fun login(request: LoginRequest): ResponseEntity<Any>

}