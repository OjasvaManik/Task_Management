package net.ojm.task_management_backend.domain.dto.group.response

import net.ojm.task_management_backend.domain.dto.task.response.AssignTaskResponse
import java.util.UUID

data class GroupCreateResponse(

    val groupId: UUID,
    val groupTitle: String,
    val groupDescription: String,
    val organisationName: String,
    val createdBy: String,
    val assignedTo: List<AssignTaskResponse>,

)
