package com.moviemator.core.user.dto;

import com.moviemator.core.user.model.UserSettings;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PublicUserDataDto {
    private Long id;
    private String cognitoUserId;
    private String displayName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private UserSettings userSettings;
    
    // New
    private Boolean isProfilePublic;
    private String contactInfo;
}
