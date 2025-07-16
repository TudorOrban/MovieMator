package com.moviemator.core.user.dto;

import com.moviemator.core.user.model.UserSettings;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDataDto {
    private Long id;
    private String cognitoUserId;
    private String email;
    private String displayName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // New
    private UserSettings userSettings;
}
