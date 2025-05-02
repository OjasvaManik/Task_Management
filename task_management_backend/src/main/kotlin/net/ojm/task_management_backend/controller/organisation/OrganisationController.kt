package net.ojm.task_management_backend.controller.organisation

import net.ojm.task_management_backend.domain.dto.organisation.request.GetAllUsersRequest
import net.ojm.task_management_backend.domain.dto.organisation.request.SearchRequest
import net.ojm.task_management_backend.domain.dto.organisation.response.GetAllUsersResponse
import net.ojm.task_management_backend.domain.dto.organisation.response.SearchResponse
import net.ojm.task_management_backend.service.services.organisation.OrganisationService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping(value = ["/api/v1/organisation"])
//@PreAuthorize("hasRole('ADMIN')")
class OrganisationController(
    private val organisationService: OrganisationService
) {

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    fun getAllUsersByOrganisation(@RequestBody request: GetAllUsersRequest): List<GetAllUsersResponse> {
        return organisationService.getAllUsersByOrganisation(request)
    }

    @GetMapping("/search")
    fun search(@RequestBody request: SearchRequest): ResponseEntity<SearchResponse> {
        return ResponseEntity.ok(organisationService.search(request))
    }

}