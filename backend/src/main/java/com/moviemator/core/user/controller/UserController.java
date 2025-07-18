package com.moviemator.core.user.controller;

import com.moviemator.core.user.dto.CreateUserDto;
import com.moviemator.core.user.dto.UpdateUserDto;
import com.moviemator.core.user.dto.UserDataDto;
import com.moviemator.core.user.dto.UserSearchDto;
import com.moviemator.core.user.service.UserService;
import com.moviemator.shared.search.models.PaginatedResults;
import com.moviemator.shared.search.models.SearchParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isUserOrAdmin(#id, authentication)")
    public ResponseEntity<UserDataDto> getUserById(@PathVariable Long id, Authentication authentication) {
        UserDataDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/cognito-id/{cognitoUserId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCognitoUserOrAdmin(#cognitoUserId, authentication) or @userSecurity.isProfilePublic(#cognitoUserId)")
    public ResponseEntity<UserDataDto> getUserByCognitoUserId(@PathVariable String cognitoUserId, Authentication authentication) {
        UserDataDto user = userService.getUserByCognitoUserId(cognitoUserId);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/search")
    // Public endpoint
    public ResponseEntity<PaginatedResults<UserSearchDto>> searchPublicUsers(
            @RequestParam(value = "searchText", required = false, defaultValue = "") String searchText,
            @RequestParam(value = "sortBy", required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "isAscending", required = false, defaultValue = "true") Boolean isAscending,
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "itemsPerPage", defaultValue = "10") Integer itemsPerPage
    ) {
        SearchParams searchParams = new SearchParams(
                searchText, sortBy, isAscending, page, itemsPerPage
        );

        PaginatedResults<UserSearchDto> results = userService.getPublicUsers(searchParams);
        return ResponseEntity.ok(results);
    }


    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.canCreateUserWithCognitoId(#userDto, authentication)")
    public ResponseEntity<UserDataDto> createUser(@RequestBody CreateUserDto userDto, Authentication authentication) {
        UserDataDto createdUser = userService.createUser(userDto);
        return ResponseEntity.ok(createdUser);
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.canUpdateUser(#userDto, authentication)")
    public ResponseEntity<UserDataDto> updateUser(@RequestBody UpdateUserDto userDto, Authentication authentication) {
        UserDataDto updatedUser = userService.updateUser(userDto);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}
