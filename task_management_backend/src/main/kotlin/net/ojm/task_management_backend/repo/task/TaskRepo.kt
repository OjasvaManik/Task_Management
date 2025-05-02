package net.ojm.task_management_backend.repo.task

import net.ojm.task_management_backend.domain.entity.group.GroupEntity
import net.ojm.task_management_backend.domain.entity.task.TaskEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface TaskRepo: JpaRepository<TaskEntity, UUID> {

    fun findAllByGroup(group: GroupEntity): List<TaskEntity>?

    fun findByTaskId(taskId: UUID): TaskEntity?

    @Query(
        """
            SELECT t.task_id, t.task_title, t.task_description, ts_rank(t.search_vector, plainto_tsquery('english', :query)) as rank
            FROM tasks t
            INNER JOIN groups g ON t.group_id = g.group_id
            WHERE g.organisation_id = :organisationId
            AND t.search_vector @@ plainto_tsquery('english', :query)
            ORDER BY rank DESC
        """, nativeQuery = true
    )
    fun search(query: String, organisationId: UUID): List<Array<Any>>

}