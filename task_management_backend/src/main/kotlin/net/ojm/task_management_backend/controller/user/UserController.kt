package net.ojm.task_management_backend.controller.user

import net.ojm.task_management_backend.domain.dto.user.request.UserUpdatePasswordRequest
import net.ojm.task_management_backend.domain.dto.user.request.UserUpdateRequest
import net.ojm.task_management_backend.service.services.user.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/user")
class UserController(
    private val userService: UserService,
) {

    @PatchMapping("/update")
    fun updateUser(@RequestBody request: UserUpdateRequest): ResponseEntity<Any> {
        return ResponseEntity.ok(userService.updateUser(request))
    }

    @PatchMapping("/update-password")
    fun updateUserPassword(@RequestBody request: UserUpdatePasswordRequest): ResponseEntity<Any> {
        return ResponseEntity.ok(userService.updatePassword(request))
    }

}