package net.ojm.task_management_backend.domain.dto.user.request

import java.util.UUID

data class UserUpdatePasswordRequest(

    val userId: UUID,
    val currentPassword: String,
    val newPassword: String

)