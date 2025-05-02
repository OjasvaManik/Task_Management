package net.ojm.task_management_backend.domain.dto.task.request

import java.util.*

data class GetTasksRequest(

    val groupId: UUID,
    val organisationId: UUID,

)
