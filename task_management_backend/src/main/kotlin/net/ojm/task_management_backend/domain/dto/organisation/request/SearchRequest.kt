package net.ojm.task_management_backend.domain.dto.organisation.request

import java.util.UUID

data class SearchRequest(
    val search: String,
    val organisationId: UUID,
)
