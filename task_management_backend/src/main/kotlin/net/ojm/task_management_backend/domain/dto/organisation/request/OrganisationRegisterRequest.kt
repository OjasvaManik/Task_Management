package net.ojm.task_management_backend.domain.dto.organisation.request

data class OrganisationRegisterRequest(

    val organisationName: String,
    val organisationEmail: String,
    val userName: String,
    val userPassword: String

)
