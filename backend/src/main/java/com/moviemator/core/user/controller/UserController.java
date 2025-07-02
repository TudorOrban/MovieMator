package com.moviemator.core.user.controller;

import com.moviemator.core.user.dto.CreateUserDto;
import com.moviemator.core.user.dto.UpdateUserDto;
import com.moviemator.core.user.dto.UserDataDto;
import com.moviemator.core.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<UserDataDto> getUserById(@PathVariable Long id) {
        UserDataDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/cognito-id/{cognitoUserId}")
    public ResponseEntity<UserDataDto> getUserByCognitoUserId(@PathVariable String cognitoUserId) {
        UserDataDto user = userService.getUserByCognitoUserId(cognitoUserId);
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<UserDataDto> createUser(@RequestBody CreateUserDto userDto) {
        UserDataDto createdUser = userService.createUser(userDto);
        return ResponseEntity.ok(createdUser);
    }

    @PutMapping
    public ResponseEntity<UserDataDto> updateUser(@RequestBody UpdateUserDto userDto) {
        UserDataDto updatedUser = userService.updateUser(userDto);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}
