package net.ojm.task_management_backend.extensions.group

import net.ojm.task_management_backend.domain.dto.group.request.GroupCreateRequest
import net.ojm.task_management_backend.domain.dto.group.response.GetGroupsResponse
import net.ojm.task_management_backend.domain.dto.group.response.GroupCreateResponse
import net.ojm.task_management_backend.domain.entity.group.GroupEntity
import net.ojm.task_management_backend.domain.entity.organisation.OrganisationEntity
import net.ojm.task_management_backend.domain.entity.user.UserEntity
import net.ojm.task_management_backend.extensions.task.toAssignTaskResponse

fun GroupCreateRequest.toGroupEntity(organisation: OrganisationEntity, users: List<UserEntity>, createdBy: UserEntity): GroupEntity{
    return GroupEntity(
        groupTitle = this.groupTitle,
        groupDescription = this.groupDescription,
        organisation = organisation,
        createdBy = createdBy,
        assignedTo = users
    )
}

fun GroupEntity.toGroupCreateResponse(organisation: OrganisationEntity): GroupCreateResponse {
    return GroupCreateResponse(
        groupId = this.groupId,
        groupTitle = this.groupTitle,
        groupDescription = this.groupDescription,
        organisationName = this.organisation.organisationName,
        createdBy = this.createdBy.userName,
        assignedTo = this.assignedTo.map { it.toAssignTaskResponse(organisation) }
    )
}

fun GroupEntity.toGetGroupResponse(organisation: OrganisationEntity): GetGroupsResponse {
    return GetGroupsResponse(
        groupId = this.groupId,
        groupTitle = this.groupTitle,
        groupDescription = this.groupDescription,
        organisationName = this.organisation.organisationName,
        createdBy = this.createdBy.userName,
        assignedTo = this.assignedTo.map { it.toAssignTaskResponse(organisation) }
    )
}