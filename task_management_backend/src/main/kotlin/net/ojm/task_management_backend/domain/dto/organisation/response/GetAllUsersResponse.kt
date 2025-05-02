package net.ojm.task_management_backend.domain.dto.organisation.response

import net.ojm.task_management_backend.domain.entity.user.RoleTypeEnum
import java.util.UUID

data class GetAllUsersResponse(

    val userId: UUID,
    val userName: String,
    val name: String,
    val role: RoleTypeEnum,
    val organisationId: UUID,

)
