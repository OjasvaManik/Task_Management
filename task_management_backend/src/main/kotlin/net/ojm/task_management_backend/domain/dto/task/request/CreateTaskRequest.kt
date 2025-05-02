package net.ojm.task_management_backend.domain.dto.task.request

import java.time.LocalDateTime
import java.util.UUID

data class CreateTaskRequest(

    val groupId: UUID,
    val taskTitle: String,
    val taskDescription: String,
    val dueDate: LocalDateTime,
    val createdBy: String,

)
