package com.moviemator.core.user.dto;

import com.moviemator.core.user.model.UserSettings;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserDto {
    private Long id;
    private String displayName;
    private UserSettings userSettings;
    private Boolean isProfilePublic;
}
