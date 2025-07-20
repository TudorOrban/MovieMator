package com.moviemator.features.movie.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovieSmallDto {
    private Long id;
    private String title;
    private String posterUrl;
}
