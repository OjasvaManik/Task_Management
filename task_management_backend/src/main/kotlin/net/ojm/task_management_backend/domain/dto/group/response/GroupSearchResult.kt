package net.ojm.task_management_backend.domain.dto.group.response

import java.util.*

data class GroupSearchResult(
    val groupId: UUID,
    val groupTitle: String,
    val groupDescription: String?,
    val rank: Float
)
