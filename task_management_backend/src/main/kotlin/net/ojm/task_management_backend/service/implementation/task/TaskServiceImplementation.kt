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

    override fun createTask(request: CreateTaskRequest): CreateTaskResponse {
        val user = userRepo.findByUserName(request.createdBy)
            ?: throw IllegalArgumentException("User not found")

        val group = groupRepo.findByGroupId(request.groupId)
            ?: throw IllegalArgumentException("Group not found")

        val organisation = organisationRepo.findByOrganisationId(group.organisation.organisationId)
            ?: throw IllegalArgumentException("Organisation not found")

        var task = request.toTaskEntity(group, user)
        task = taskRepo.save(task)
        return task.toCreateTaskResponse(organisation)
    }

    override fun getAllTasksByGroup(request: GetTasksRequest): List<GetTasksResponse> {
        val organisation = organisationRepo.findByOrganisationId(request.organisationId)
            ?: throw IllegalArgumentException("Organisation not found")

        val group = groupRepo.findByGroupId(request.groupId)
            ?: throw IllegalArgumentException("Group not found")

        val tasks = taskRepo.findAllByGroup(group)
            ?: throw IllegalArgumentException("Tasks not found")

        return tasks.map { it.toGetTaskResponse(organisation) }
    }

    override fun setTaskStatus(taskId: UUID, status: ProgressTypeEnum): Boolean {
        return try {
            var task = taskRepo.findByTaskId(taskId)
                ?: throw IllegalArgumentException("Task not found")
            task = task.copy(status = status)
            taskRepo.save(task)
            true
        } catch (ex: Exception) {
            false
        }
    }

}