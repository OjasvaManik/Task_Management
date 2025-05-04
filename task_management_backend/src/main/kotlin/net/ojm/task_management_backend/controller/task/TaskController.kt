package net.ojm.task_management_backend.controller.task

import net.ojm.task_management_backend.domain.dto.task.request.CreateTaskRequest
import net.ojm.task_management_backend.domain.dto.task.request.GetTasksRequest
import net.ojm.task_management_backend.domain.dto.task.request.SetTaskStatusRequest
import net.ojm.task_management_backend.domain.dto.task.response.CreateTaskResponse
import net.ojm.task_management_backend.domain.dto.task.response.GetTasksResponse
import net.ojm.task_management_backend.service.services.group.GroupService
import net.ojm.task_management_backend.service.services.task.TaskService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/v1/task")
class TaskController(
    private val taskService: TaskService,
    private val groupService: GroupService,
) {

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    fun createTask(@RequestBody request: List<CreateTaskRequest>): ResponseEntity<List<CreateTaskResponse>> {
        return ResponseEntity.ok(taskService.createTasks(request))
    }

    @GetMapping("/group/{groupId}")
    fun getAllTasksByGroup(@PathVariable groupId: UUID): ResponseEntity<List<GetTasksResponse>> {
        return ResponseEntity.ok(taskService.getAllTasksByGroup(groupId))
    }

    @PostMapping("/set-status")
    fun setTaskStatus(@RequestBody request: SetTaskStatusRequest): ResponseEntity<Boolean> {
        return ResponseEntity.ok(taskService.setTaskStatus(request.taskId, request.status))
    }

}