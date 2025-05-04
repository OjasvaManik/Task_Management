package net.ojm.task_management_backend.jwt

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Lazy
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class AuthTokenFilter(
    private val jwtUtils: JwtUtils,
    @Lazy private val userDetailsService: UserDetailsService
) : OncePerRequestFilter() {

    private val logger = LoggerFactory.getLogger(AuthTokenFilter::class.java)

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        logger.debug("AuthTokenFilter called for URI: ${request.requestURI}")

        // Log request headers for debugging
        logger.debug("Request headers:")
        val headerNames = request.headerNames
        while (headerNames.hasMoreElements()) {
            val headerName = headerNames.nextElement()
            logger.debug("$headerName: ${request.getHeader(headerName)}")
        }

        try {
            val jwt = parseJwt(request)
            logger.debug("JWT token extracted: ${jwt != null}")

            if (jwt != null) {
                val isValid = jwtUtils.validateJwtToken(jwt)
                logger.debug("JWT validation result: $isValid")

                if (isValid) {
                    val username = jwtUtils.getUserNameFromJwtToken(jwt)
                    logger.debug("Username from JWT: $username")

                    try {
                        val userDetails = userDetailsService.loadUserByUsername(username)
                        logger.debug("User details loaded successfully: ${userDetails.username}")
                        logger.debug("User authorities: ${userDetails.authorities}")

                        val authentication = UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.authorities
                        )
                        authentication.details = WebAuthenticationDetailsSource().buildDetails(request)
                        SecurityContextHolder.getContext().authentication = authentication
                        logger.debug("Authentication set in SecurityContext")
                    } catch (e: Exception) {
                        logger.error("Error loading user details for username: $username", e)
                    }
                } else {
                    logger.warn("Invalid JWT token")
                }
            } else {
                logger.debug("No JWT token found in request")
            }
        } catch (e: Exception) {
            logger.error("Authentication process failed", e)
        }

        filterChain.doFilter(request, response)
    }

    private fun parseJwt(request: HttpServletRequest): String? {
        val jwt = jwtUtils.getJwtFromHeader(request)
        logger.debug("JWT from header: ${jwt?.take(10)}${if (jwt != null && jwt.length > 10) "..." else ""}")
        return jwt
    }
}