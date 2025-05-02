package net.ojm.task_management_backend.service.services.group

import net.ojm.task_management_backend.domain.dto.group.request.GetGroupsRequest
import net.ojm.task_management_backend.domain.dto.group.request.GroupCreateRequest
import net.ojm.task_management_backend.domain.dto.group.response.GetGroupsResponse
import net.ojm.task_management_backend.domain.dto.group.response.GroupCreateResponse
import java.util.UUID

interface GroupService {

    fun createGroup(request: GroupCreateRequest): GroupCreateResponse

    fun getAllGroups(request: GetGroupsRequest): List<GetGroupsResponse>

}