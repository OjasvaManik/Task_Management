package net.ojm.task_management_backend.domain.dto.group.request

import net.ojm.task_management_backend.domain.dto.task.request.AssignTaskRequest

data class GroupCreateRequest(

    val groupTitle: String,
    val groupDescription: String,
    val organisationName: String,
    val createdBy: String,
    val assignedTo: List<AssignTaskRequest>,

)
