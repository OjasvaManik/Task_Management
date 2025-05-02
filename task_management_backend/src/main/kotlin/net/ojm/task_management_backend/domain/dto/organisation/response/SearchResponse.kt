package net.ojm.task_management_backend.domain.dto.organisation.response

import net.ojm.task_management_backend.domain.dto.group.response.GroupSearchResult
import net.ojm.task_management_backend.domain.dto.task.response.TaskSearchResult

data class SearchResponse(
    val groups: List<GroupSearchResult>,
    val tasks: List<TaskSearchResult>
)
