package net.ojm.task_management_backend.repo.user

import net.ojm.task_management_backend.domain.entity.organisation.OrganisationEntity
import net.ojm.task_management_backend.domain.entity.user.UserEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface UserRepo: JpaRepository<UserEntity, UUID> {

    fun findByUserName(userName: String): UserEntity?;

    fun existsByEmail(email: String): Boolean;

    fun existsByUserName(userName: String): Boolean;

    fun findAllByUserNameIn(userName: List<String>): List<UserEntity>;

    fun findByUserNameAndOrganisation(userName: String, organisation: OrganisationEntity): UserEntity?

    fun findAllByOrganisation(organisation: OrganisationEntity): List<UserEntity>;

    fun existsByOrganisationAndUserName(organisation: OrganisationEntity, userName: String): Boolean;

    fun findByEmail(email: String): UserEntity?;

    fun findByUserNameContainingIgnoreCase(userName: String): UserEntity?;

}