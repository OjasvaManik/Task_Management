package net.ojm.task_management_backend.domain.dto.task.response

import java.util.*

data class TaskSearchResult(

    val taskId: UUID,
    val taskTitle: String,
    val taskDescription: String?,
    val rank: Float

)
