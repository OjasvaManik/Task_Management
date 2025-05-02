package net.ojm.task_management_backend.config

import org.springframework.context.annotation.Configuration
import org.springframework.data.jpa.repository.config.EnableJpaAuditing

@EnableJpaAuditing
@Configuration
class JpaAuditingConfig {
}