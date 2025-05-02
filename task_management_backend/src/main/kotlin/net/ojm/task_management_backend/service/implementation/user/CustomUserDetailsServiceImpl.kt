package net.ojm.task_management_backend.service.implementation.user

import net.ojm.task_management_backend.repo.user.UserRepo
import net.ojm.task_management_backend.service.services.user.CustomUserDetails
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class CustomUserDetailsServiceImpl(
    private val userRepo: UserRepo
) : UserDetailsService {

    override fun loadUserByUsername(userName: String): UserDetails {
        val user = userRepo.findByUserName(userName)
            ?: throw UsernameNotFoundException("User not found with username: $userName")
        return CustomUserDetails(user)
    }
}