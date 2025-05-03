package net.ojm.task_management_backend.service.services.user

import net.ojm.task_management_backend.domain.dto.user.request.UserUpdatePasswordRequest
import net.ojm.task_management_backend.domain.dto.user.request.UserUpdateRequest

interface UserService {

    fun updateUser(request: UserUpdateRequest): Any

    fun updatePassword(request: UserUpdatePasswordRequest): Any

}