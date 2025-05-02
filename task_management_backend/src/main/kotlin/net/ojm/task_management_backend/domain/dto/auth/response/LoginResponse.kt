package net.ojm.task_management_backend.domain.dto.auth.response

import net.ojm.task_management_backend.domain.entity.user.RoleTypeEnum
import java.util.UUID

data class LoginResponse(

    val userId: UUID,
    val name: String,
    val userName: String,
    val organisationName: String,
    val organisationId: UUID,
    val role: String,
    val jwtToken: String,

)
