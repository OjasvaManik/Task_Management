package net.ojm.task_management_backend.extensions.user

import net.ojm.task_management_backend.domain.dto.user.response.UserUpdateResponse
import net.ojm.task_management_backend.domain.entity.user.UserEntity

fun UserEntity.toUserUpdateResponse(): UserUpdateResponse {
    return UserUpdateResponse(
        userId = this.userId,
        userName = this.userName,
        name = this.name,
        organisationName = this.organisation.organisationName,
        organisationId = this.organisation.organisationId,
        role = this.role.toString(),
    )
}