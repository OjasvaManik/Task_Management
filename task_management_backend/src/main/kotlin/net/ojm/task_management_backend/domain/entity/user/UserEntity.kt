package net.ojm.task_management_backend.domain.entity.user

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.persistence.*
import net.ojm.task_management_backend.domain.common.BaseTimeEntity
import net.ojm.task_management_backend.domain.entity.organisation.OrganisationEntity
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.util.UUID

@Entity
@JsonIgnoreProperties("hibernateLazyInitializer", "handler")
@Table(name = "users")
@Access(AccessType.FIELD)
data class UserEntity(

    @Id
    @GeneratedValue
    @Column(name = "user_id", nullable = false, unique = true)
    val userId: UUID = UUID.randomUUID(),

    @Column(name = "user_name", nullable = false, unique = true)
    val userName: String,

    @Column(name = "name")
    val name: String,

    @Column(name = "email", nullable = false, unique = true)
    val email: String,

    @Column(name = "user_password", nullable = false)
    val userPassword: String,

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    val role: RoleTypeEnum = RoleTypeEnum.USER,

    @Column(name = "is_banned", nullable = false)
    val isBanned: Boolean,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organisation_id", nullable = false)
    val organisation: OrganisationEntity

): BaseTimeEntity(), UserDetails {

    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return mutableListOf(SimpleGrantedAuthority("ROLE_${role.name}"))
    }

    override fun getPassword(): String = userPassword

    override fun getUsername(): String = userName

    override fun isAccountNonExpired(): Boolean = true

    override fun isAccountNonLocked(): Boolean = !isBanned

    override fun isCredentialsNonExpired(): Boolean = true

    override fun isEnabled(): Boolean = true

}
