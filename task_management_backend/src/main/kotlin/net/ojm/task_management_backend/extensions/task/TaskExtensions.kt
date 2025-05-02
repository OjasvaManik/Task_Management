package net.ojm.task_management_backend.extensions.task

import net.ojm.task_management_backend.domain.dto.task.request.CreateTaskRequest
import net.ojm.task_management_backend.domain.dto.task.response.AssignTaskResponse
import net.ojm.task_management_backend.domain.dto.task.response.CreateTaskResponse
import net.ojm.task_management_backend.domain.dto.task.response.GetTasksResponse
import net.ojm.task_management_backend.domain.entity.group.GroupEntity
import net.ojm.task_management_backend.domain.entity.organisation.OrganisationEntity
import net.ojm.task_management_backend.domain.entity.task.ProgressTypeEnum
import net.ojm.task_management_backend.domain.entity.task.TaskEntity
import net.ojm.task_management_backend.domain.entity.user.UserEntity

fun UserEntity.toAssignTaskResponse(organisation: OrganisationEntity): AssignTaskResponse {
    return AssignTaskResponse(
        userName = this.userName,
        organisationName = organisation.organisationName,
    )
}

fun CreateTaskRequest.toTaskEntity(group: GroupEntity, createdBy: UserEntity): TaskEntity {
    return TaskEntity(
        taskTitle = this.taskTitle,
        taskDescription = this.taskDescription,
        dueDate = this.dueDate,
        createdBy = createdBy,
        group = group,
        status = ProgressTypeEnum.TODO
    )
}

fun TaskEntity.toCreateTaskResponse(organisation: OrganisationEntity): CreateTaskResponse {
    return CreateTaskResponse(
        taskId = this.taskId,
        taskTitle = this.taskTitle,
        taskDescription = this.taskDescription,
        dueDate = this.dueDate,
        createdBy = this.createdBy.userName,
        groupId = this.group.groupId,
        status = this.status,
        organisationId = organisation.organisationId,
    )
}

fun TaskEntity.toGetTaskResponse(organisation: OrganisationEntity): GetTasksResponse {
    return GetTasksResponse(
        taskId = this.taskId,
        taskTitle = this.taskTitle,
        taskDescription = this.taskDescription,
        dueDate = this.dueDate,
        createdBy = this.createdBy.userName,
        groupId = this.group.groupId,
        status = this.status,
        organisationId = organisation.organisationId,
    )
}