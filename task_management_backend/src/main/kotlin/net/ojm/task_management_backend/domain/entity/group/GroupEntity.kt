package net.ojm.task_management_backend.domain.entity.group

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.persistence.*
import net.ojm.task_management_backend.domain.common.BaseTimeEntity
import net.ojm.task_management_backend.domain.entity.organisation.OrganisationEntity
import net.ojm.task_management_backend.domain.entity.user.UserEntity
import java.util.UUID

@Entity
@Table(name = "groups")
@JsonIgnoreProperties("hibernateLazyInitializer", "handler")
data class GroupEntity(

    @Id
    @GeneratedValue
    @Column(nullable = false, name = "group_id", unique = true)
    val groupId: UUID = UUID.randomUUID(),

    @Column(nullable = false, name = "group_title")
    val groupTitle: String,

    @Column(nullable = false, name = "group_description")
    val groupDescription: String,

    @ManyToOne(fetch = FetchType.LAZY, cascade = [(CascadeType.PERSIST)])
    @JoinColumn(name = "organisation_id", nullable = false)
    val organisation: OrganisationEntity,

    @ManyToOne(fetch = FetchType.LAZY, cascade = [(CascadeType.PERSIST)])
    @JoinColumn(name = "user_id", nullable = false)
    val createdBy: UserEntity,

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "group_user_assignments",
        joinColumns = [JoinColumn(name = "group_id")],
        inverseJoinColumns = [JoinColumn(name = "user_id")]
    )
    val assignedTo: List<UserEntity> = emptyList()


): BaseTimeEntity()
