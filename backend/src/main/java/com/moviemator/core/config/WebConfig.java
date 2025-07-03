package com.moviemator.core.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(WebConfig.class);

    private final Environment env;

    public WebConfig(Environment env) {
        this.env = env;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String frontendApiUrl = env.getProperty("FRONTEND_API_URL");
        if (frontendApiUrl == null) {
            logger.warn("FRONTEND_API_URL environment variable not set. CORS might not work correctly.");
            frontendApiUrl = "http://localhost:4200";
        }

        registry.addMapping("/**")
                .allowedOrigins(frontendApiUrl)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
