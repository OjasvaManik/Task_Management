package net.ojm.task_management_backend.service.services.organisation

import net.ojm.task_management_backend.domain.dto.organisation.request.AdminUserRequest
import net.ojm.task_management_backend.domain.dto.organisation.request.GetAllUsersRequest
import net.ojm.task_management_backend.domain.dto.organisation.request.SearchRequest
import net.ojm.task_management_backend.domain.dto.organisation.response.AdminUserResponse
import net.ojm.task_management_backend.domain.dto.organisation.response.GetAllUsersResponse
import net.ojm.task_management_backend.domain.dto.organisation.response.SearchResponse

interface OrganisationService {

    fun getAllUsersByOrganisation(request: GetAllUsersRequest): List<GetAllUsersResponse>

    fun search(request: SearchRequest): SearchResponse

    fun makeAdmin(request: AdminUserRequest): AdminUserResponse

}