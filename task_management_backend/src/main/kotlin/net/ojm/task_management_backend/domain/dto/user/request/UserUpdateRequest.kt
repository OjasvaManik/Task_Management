package net.ojm.task_management_backend.domain.dto.user.request

import java.util.UUID

data class UserUpdateRequest(

    val userId: UUID,
    val userName: String?,
    val name: String?,

)
