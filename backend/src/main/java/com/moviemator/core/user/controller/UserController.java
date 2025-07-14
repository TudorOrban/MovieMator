package com.moviemator.core.user.controller;

import com.moviemator.core.user.dto.CreateUserDto;
import com.moviemator.core.user.dto.UpdateUserDto;
import com.moviemator.core.user.dto.UserDataDto;
import com.moviemator.core.user.service.UserService;
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
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCognitoUserOrAdmin(#cognitoUserId, authentication)")
    public ResponseEntity<UserDataDto> getUserByCognitoUserId(@PathVariable String cognitoUserId, Authentication authentication) {
        UserDataDto user = userService.getUserByCognitoUserId(cognitoUserId);
        return ResponseEntity.ok(user);
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
