package net.ojm.task_management_backend.domain.entity.organisation

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.persistence.*
import net.ojm.task_management_backend.domain.common.BaseTimeEntity
import java.util.*

@Entity
@Table(name = "organisations")
@JsonIgnoreProperties("hibernateLazyInitializer", "handler")
data class OrganisationEntity(

    @Id
    @GeneratedValue
    @Column(nullable = false, name = "organisation_id", unique = true)
    val organisationId: UUID = UUID.randomUUID(),

    @Column(nullable = false, name = "organisation_name")
    val organisationName: String,

    @Column(nullable = false, name = "organisation_email")
    val organisationEmail: String,

): BaseTimeEntity()
