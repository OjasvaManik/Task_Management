package net.ojm.task_management_backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class TaskManagementBackendApplication

fun main(args: Array<String>) {
    runApplication<TaskManagementBackendApplication>(*args)
}
