package net.ojm.task_management_backend.extensions.auth

import net.ojm.task_management_backend.domain.dto.auth.request.LoginRequest
import net.ojm.task_management_backend.domain.dto.auth.request.RegisterRequest
import net.ojm.task_management_backend.domain.dto.auth.response.LoginResponse
import net.ojm.task_management_backend.domain.dto.organisation.request.OrganisationRegisterRequest
import net.ojm.task_management_backend.domain.entity.organisation.OrganisationEntity
import net.ojm.task_management_backend.domain.entity.user.UserEntity
import net.ojm.task_management_backend.domain.entity.user.RoleTypeEnum
import net.ojm.task_management_backend.service.services.user.CustomUserDetails
import org.springframework.security.core.userdetails.UserDetails

fun RegisterRequest.toUserEntity(organisationEntity: OrganisationEntity): UserEntity {
    return UserEntity(
        userName = this.userName,
        userPassword = this.userPassword,
        email = this.email,
        name = this.name,
        role = RoleTypeEnum.USER,
        isBanned = false,
        organisation = organisationEntity,
    )
}

fun OrganisationRegisterRequest.toOrganisationEntity(): OrganisationEntity {
    return OrganisationEntity(
        organisationName = this.organisationName,
        organisationEmail = this.organisationEmail,
    )
}

fun OrganisationRegisterRequest.toUserEntity(organisationEntity: OrganisationEntity): UserEntity {
    return UserEntity(
        userName = this.userName,
        userPassword = this.userPassword,
        email = this.organisationEmail,
        name = this.organisationName,
        role = RoleTypeEnum.ADMIN,
        isBanned = false,
        organisation = organisationEntity,
    )
}