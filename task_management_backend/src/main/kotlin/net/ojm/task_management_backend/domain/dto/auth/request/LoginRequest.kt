package net.ojm.task_management_backend.domain.dto.auth.request

data class LoginRequest(

    val userPassword: String,
    val userName: String,
    val organisationName: String,

)
