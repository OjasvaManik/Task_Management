package net.ojm.task_management_backend.controller.group

import net.ojm.task_management_backend.domain.dto.group.request.GetGroupsRequest
import net.ojm.task_management_backend.domain.dto.group.request.GroupCreateRequest
import net.ojm.task_management_backend.domain.dto.group.response.GetGroupsResponse
import net.ojm.task_management_backend.domain.dto.group.response.GroupCreateResponse
import net.ojm.task_management_backend.service.services.group.GroupService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping(path = ["/api/v1/group"])
class GroupController(
    private val groupService: GroupService,
) {

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    fun createGroup(@RequestBody request: GroupCreateRequest): ResponseEntity<GroupCreateResponse> {
        return ResponseEntity.ok(groupService.createGroup(request))
    }

    @GetMapping
    fun getAllGroups(@RequestBody request: GetGroupsRequest): ResponseEntity<List<GetGroupsResponse>> {
        return ResponseEntity.ok(groupService.getAllGroups(request))
    }

}