package net.ojm.task_management_backend.repo.group

import net.ojm.task_management_backend.domain.entity.group.GroupEntity
import net.ojm.task_management_backend.domain.entity.organisation.OrganisationEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface GroupRepo: JpaRepository<GroupEntity, UUID> {

    fun findByGroupId(groupId: UUID): GroupEntity?

    fun findAllByOrganisation(organisation: OrganisationEntity): List<GroupEntity>?

    @Query(
        """
            SELECT g.group_id, g.group_title, g.group_description, ts_rank(g.search_vector, plainto_tsquery('english', :query)) as rank
            FROM groups g
            WHERE g.organisation_id = :organisationId
            AND g.search_vector @@ plainto_tsquery('english', :query)
            ORDER BY rank DESC
        """, nativeQuery = true
    )
    fun search(query: String, organisationId: UUID): List<Array<Any>>
}