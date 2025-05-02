package net.ojm.task_management_backend.domain.dto.task.request

import net.ojm.task_management_backend.domain.entity.task.ProgressTypeEnum
import java.util.UUID

data class SetTaskStatusRequest(

    val taskId: UUID,
    val status: ProgressTypeEnum

)
