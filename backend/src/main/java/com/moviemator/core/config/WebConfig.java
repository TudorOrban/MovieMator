package com.moviemator.core.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

//@Configuration
public class WebConfig {

    private static final Logger logger = LoggerFactory.getLogger(WebConfig.class);

    private final Environment env;

    public WebConfig(Environment env) {
        this.env = env;
    }

//    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String allowedOriginsCsv = env.getProperty("ALLOWED_CORS_ORIGINS");

        Set<String> allowedOrigins = new HashSet<>();
        if (allowedOriginsCsv != null && !allowedOriginsCsv.isEmpty()) {
            allowedOrigins.addAll(Arrays.asList(allowedOriginsCsv.split(",")));
            logger.info("Configuring CORS with allowed origins: {}", allowedOrigins);
        } else {
            logger.warn("ALLOWED_CORS_ORIGINS environment variable not set. Falling back to localhost.");
            allowedOrigins.add("http://localhost:4200");
        }


        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins.toArray(new String[0]))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
