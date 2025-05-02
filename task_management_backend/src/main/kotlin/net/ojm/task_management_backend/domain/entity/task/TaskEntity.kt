package net.ojm.task_management_backend.domain.entity.task

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.persistence.*
import net.ojm.task_management_backend.domain.common.BaseTimeEntity
import net.ojm.task_management_backend.domain.entity.group.GroupEntity
import net.ojm.task_management_backend.domain.entity.user.UserEntity
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "tasks")
@JsonIgnoreProperties("hibernateLazyInitializer", "handler")
data class TaskEntity(

    @Id
    @GeneratedValue
    @Column(nullable = false, name = "task_id", unique = true)
    val taskId : UUID = UUID.randomUUID(),

    @Column(nullable = false, name = "task_title")
    val taskTitle: String,

    @Column(nullable = false, name = "task_description")
    val taskDescription: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "task_status")
    val status: ProgressTypeEnum = ProgressTypeEnum.TODO,

    @Column(nullable = false, name = "task_due_date")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
    val dueDate: LocalDateTime,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val createdBy: UserEntity,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    val group: GroupEntity

): BaseTimeEntity()
