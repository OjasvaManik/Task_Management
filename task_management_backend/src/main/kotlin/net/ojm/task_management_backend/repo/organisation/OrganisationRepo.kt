package net.ojm.task_management_backend.repo.organisation

import net.ojm.task_management_backend.domain.entity.group.GroupEntity
import net.ojm.task_management_backend.domain.entity.organisation.OrganisationEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface OrganisationRepo: JpaRepository<OrganisationEntity, UUID> {

    fun findByOrganisationName(organisationName: String): OrganisationEntity?

    fun existsByOrganisationName(organisationName: String): Boolean

    fun findByOrganisationId(organisationId: UUID): OrganisationEntity?


}