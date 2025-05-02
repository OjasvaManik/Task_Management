package net.ojm.task_management_backend.service.services.task

import net.ojm.task_management_backend.domain.dto.task.request.CreateTaskRequest
import net.ojm.task_management_backend.domain.dto.task.request.GetTasksRequest
import net.ojm.task_management_backend.domain.dto.task.response.CreateTaskResponse
import net.ojm.task_management_backend.domain.dto.task.response.GetTasksResponse
import net.ojm.task_management_backend.domain.entity.task.ProgressTypeEnum
import java.util.UUID

interface TaskService {

    fun createTask(request: CreateTaskRequest): CreateTaskResponse

    fun getAllTasksByGroup(request: GetTasksRequest): List<GetTasksResponse>

    fun setTaskStatus(taskId: UUID, status: ProgressTypeEnum): Boolean

}