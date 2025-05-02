package net.ojm.task_management_backend.domain.dto.group.response

import net.ojm.task_management_backend.domain.dto.task.response.AssignTaskResponse
import java.util.*

data class GetGroupsResponse(

    val groupId: UUID,
    val groupTitle: String,
    val groupDescription: String,
    val organisationName: String,
    val createdBy: String,
    val assignedTo: List<AssignTaskResponse>,

    )
