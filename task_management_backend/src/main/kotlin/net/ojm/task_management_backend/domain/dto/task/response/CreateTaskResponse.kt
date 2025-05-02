package net.ojm.task_management_backend.domain.dto.task.response

import net.ojm.task_management_backend.domain.entity.task.ProgressTypeEnum
import java.time.LocalDateTime
import java.util.*

data class CreateTaskResponse(

    val taskId: UUID,
    val taskTitle: String,
    val taskDescription: String,
    val dueDate: LocalDateTime,
    val createdBy: String,
    val groupId: UUID,
    val status: ProgressTypeEnum,
    val organisationId: UUID,

)
