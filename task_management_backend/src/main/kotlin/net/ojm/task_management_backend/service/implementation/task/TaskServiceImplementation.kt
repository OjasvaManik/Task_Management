package net.ojm.task_management_backend.service.implementation.task

import net.ojm.task_management_backend.domain.dto.task.request.CreateTaskRequest
import net.ojm.task_management_backend.domain.dto.task.request.GetTasksRequest
import net.ojm.task_management_backend.domain.dto.task.response.CreateTaskResponse
import net.ojm.task_management_backend.domain.dto.task.response.GetTasksResponse
import net.ojm.task_management_backend.domain.entity.task.ProgressTypeEnum
import net.ojm.task_management_backend.extensions.task.toCreateTaskResponse
import net.ojm.task_management_backend.extensions.task.toGetTaskResponse
import net.ojm.task_management_backend.extensions.task.toTaskEntity
import net.ojm.task_management_backend.repo.group.GroupRepo
import net.ojm.task_management_backend.repo.organisation.OrganisationRepo
import net.ojm.task_management_backend.repo.task.TaskRepo
import net.ojm.task_management_backend.repo.user.UserRepo
import net.ojm.task_management_backend.service.services.task.TaskService
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class TaskServiceImplementation(
    private val taskRepo: TaskRepo,
    private val groupRepo: GroupRepo,
    private val userRepo: UserRepo,
    private val organisationRepo: OrganisationRepo
): TaskService {

    override fun createTasks(requestList: List<CreateTaskRequest>): List<CreateTaskResponse> {
        if (requestList.isEmpty()) {
            throw IllegalArgumentException("Request list cannot be empty")
        }

        val groupId = requestList.first().groupId

        // Ensure all requests belong to the same group
        if (!requestList.all { it.groupId == groupId }) {
            throw IllegalArgumentException("All tasks must belong to the same group")
        }

        val user = userRepo.findByUserName(requestList.first().createdBy)
            ?: throw IllegalArgumentException("User not found")

        val group = groupRepo.findByGroupId(groupId)
            ?: throw IllegalArgumentException("Group not found")

        val organisation = organisationRepo.findByOrganisationId(group.organisation.organisationId)
            ?: throw IllegalArgumentException("Organisation not found")

        val tasks = requestList.map { it.toTaskEntity(group, user) }
        val savedTasks = taskRepo.saveAll(tasks)

        return savedTasks.map { it.toCreateTaskResponse(organisation) }
    }


    override fun getAllTasksByGroup(groupId: UUID): List<GetTasksResponse> {
        val group = groupRepo.findByGroupId(groupId)
            ?: throw IllegalArgumentException("Group not found")

        val organisation = group.organisation


        val tasks = taskRepo.findAllByGroup(group)
            ?: throw IllegalArgumentException("Tasks not found")

        return tasks.map { it.toGetTaskResponse(organisation) }
    }

    override fun setTaskStatus(taskId: UUID, status: ProgressTypeEnum): Boolean {
        val task = taskRepo.findByTaskId(taskId) ?: return false
        val updated = task.copy(status = status)
        taskRepo.save(updated)
        return true
    }


}