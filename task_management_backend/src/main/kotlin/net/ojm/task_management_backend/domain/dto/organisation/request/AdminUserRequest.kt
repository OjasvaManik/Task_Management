package net.ojm.task_management_backend.domain.dto.organisation.request

import net.ojm.task_management_backend.domain.entity.user.RoleTypeEnum
import java.util.UUID

data class AdminUserRequest(

    val userName: String,
    val role: RoleTypeEnum,
    val organisationId: UUID,
    val organisationName: String,

)
