package net.ojm.task_management_backend.service.implementation.group

import net.ojm.task_management_backend.domain.dto.group.request.GetGroupsRequest
import net.ojm.task_management_backend.domain.dto.group.request.GroupCreateRequest
import net.ojm.task_management_backend.domain.dto.group.response.GetGroupsResponse
import net.ojm.task_management_backend.domain.dto.group.response.GroupCreateResponse
import net.ojm.task_management_backend.extensions.group.toGetGroupResponse
import net.ojm.task_management_backend.extensions.group.toGroupCreateResponse
import net.ojm.task_management_backend.extensions.group.toGroupEntity
import net.ojm.task_management_backend.repo.group.GroupRepo
import net.ojm.task_management_backend.repo.organisation.OrganisationRepo
import net.ojm.task_management_backend.repo.task.TaskRepo
import net.ojm.task_management_backend.repo.user.UserRepo
import net.ojm.task_management_backend.service.services.group.GroupService
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class GroupServiceImplementation(
    private val groupRepo: GroupRepo,
    private val organisationRepo: OrganisationRepo,
    private val userRepo: UserRepo,
    private val taskRepo: TaskRepo,
): GroupService {

    override fun createGroup(request: GroupCreateRequest): GroupCreateResponse {
        val organisation = organisationRepo.findByOrganisationName(request.organisationName)
            ?: throw IllegalArgumentException("Organisation not found")

        val createdBy = userRepo.findByUserName(request.createdBy)
            ?: throw IllegalArgumentException("User not found")

        val users = userRepo.findAllByUserNameIn(request.assignedTo.map { it.userName })
            ?: throw IllegalArgumentException("Users not found")
        val group = request.toGroupEntity(organisation, users, createdBy)
        val savedGroup = groupRepo.save(group)
        return savedGroup.toGroupCreateResponse(organisation)
    }

    override fun getAllGroups(request: GetGroupsRequest): List<GetGroupsResponse> {
        val organisation = organisationRepo.findByOrganisationId(request.organisationId)
            ?: throw IllegalArgumentException("Organisation not found")

        val groups = groupRepo.findAllByOrganisation(organisation)
            ?: throw IllegalArgumentException("Groups not found")
        return groups.map { it.toGetGroupResponse(organisation) }
    }

}