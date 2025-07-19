package com.moviemator.core.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSearchDto {
    private Long id;
    private String cognitoUserId;
    private String displayName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // New
    private Boolean isProfilePublic;
    private String contactInfo;
}
