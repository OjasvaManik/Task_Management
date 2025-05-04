package net.ojm.task_management_backend.service.implementation.organisation

import jakarta.persistence.EntityNotFoundException
import net.ojm.task_management_backend.domain.dto.group.response.GroupSearchResult
import net.ojm.task_management_backend.domain.dto.organisation.request.AdminUserRequest
import net.ojm.task_management_backend.domain.dto.organisation.request.GetAllUsersRequest
import net.ojm.task_management_backend.domain.dto.organisation.request.OrganisationRegisterRequest
import net.ojm.task_management_backend.domain.dto.organisation.request.SearchRequest
import net.ojm.task_management_backend.domain.dto.organisation.response.AdminUserResponse
import net.ojm.task_management_backend.domain.dto.organisation.response.GetAllUsersResponse
import net.ojm.task_management_backend.domain.dto.organisation.response.SearchResponse
import net.ojm.task_management_backend.domain.dto.task.response.TaskSearchResult
import net.ojm.task_management_backend.domain.entity.user.RoleTypeEnum
import net.ojm.task_management_backend.repo.group.GroupRepo
import net.ojm.task_management_backend.repo.organisation.OrganisationRepo
import net.ojm.task_management_backend.repo.task.TaskRepo
import net.ojm.task_management_backend.repo.user.UserRepo
import net.ojm.task_management_backend.service.services.organisation.OrganisationService
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class OrganisationServiceImplementation(
    private val organisationRepo: OrganisationRepo,
    private val userRepo: UserRepo,
    private val groupRepo: GroupRepo,
    private val taskRepo: TaskRepo,
): OrganisationService {

    override fun getAllUsersByOrganisation(organisationId: UUID): List<GetAllUsersResponse> {
        println("🔍 Fetching users for organisation ID: $organisationId")

        val organisation = organisationRepo.findById(organisationId)
        if (organisation.isPresent) {
            println("✅ Organisation found: ${organisation.get().organisationName}")

            val users = userRepo.findAllByOrganisation(organisation.get())
            println("👥 Number of users found: ${users.size}")

            users.forEach { user ->
                println("➡️ User: ${user.name}, Username: ${user.userName}, Role: ${user.role}")
            }

            return users.map { user ->
                GetAllUsersResponse(
                    userId = user.userId,
                    name = user.name,
                    role = user.role,
                    userName = user.userName,
                    organisationId = organisation.get().organisationId
                )
            }
        } else {
            println("❌ Organisation not found for ID: $organisationId")
            throw Exception("Organisation not found")
        }
    }


    override fun search(request: SearchRequest): SearchResponse {
        val groups = groupRepo.search(request.search, request.organisationId)
            .map { result ->
                GroupSearchResult(
                    groupId = result[0] as UUID,
                    groupTitle = result[1] as String,
                    groupDescription = result[2] as String?,
                    rank = result[3] as Float
                )
            }

        val tasks = taskRepo.search(request.search, request.organisationId)
            .map { result ->
                TaskSearchResult(
                    taskId = result[0] as UUID,
                    taskTitle = result[1] as String,
                    taskDescription = result[2] as String?,
                    rank = result[3] as Float
                )
            }

        return SearchResponse(groups, tasks)
    }

    override fun makeAdmin(request: AdminUserRequest): AdminUserResponse {
        val organisation = organisationRepo.findById(request.organisationId)
        if (organisation.isPresent) {
            val user = userRepo.findByUserName(request.userName)
            ?: throw EntityNotFoundException("User not found")
            if (user.organisation.organisationId == organisation.get().organisationId) {
                if (user.role == RoleTypeEnum.ADMIN) {
                    throw Exception("User is already an admin")
                }
                else {
                    val updatedUser = user.copy(role = RoleTypeEnum.ADMIN)
                    userRepo.save(updatedUser)
                }
                return AdminUserResponse(
                    userId = user.userId,
                    role = user.role,
                    userName = user.userName,
                    organisationId = organisation.get().organisationId,
                    organisationName = organisation.get().organisationName,
                )
            } else {
                throw Exception("User not found in this organisation")
            }
        }
        else {
            throw Exception("Organisation not found")
        }
    }

}