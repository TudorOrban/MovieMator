package com.moviemator.shared.error.types;

import lombok.Getter;

@Getter
public class ResourceNotFoundException extends RuntimeException {

    private final String identifier;
    private final ResourceType resourceType;
    private final ResourceIdentifierType identifierType;

    public ResourceNotFoundException(String identifier, ResourceType resourceType, ResourceIdentifierType identifierType) {
        super("The " + resourceType.toString() +
                " with " + identifierType.toString() + ": " + identifier +
                " was not found.");
        this.identifier = identifier;
        this.resourceType = resourceType;
        this.identifierType = identifierType;
    }
}
