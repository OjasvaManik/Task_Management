package net.ojm.task_management_backend.domain.dto.auth.request

data class RegisterRequest(

    val userName: String,
    val userPassword: String,
    val email: String,
    val name: String,
    val organisationName: String

)
