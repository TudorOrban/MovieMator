package com.moviemator.shared.error.types;

import lombok.Getter;

@Getter
public class ResourceAlreadyExistsException extends RuntimeException {

    private String identifier;
    private ResourceType resourceType;
    private ResourceIdentifierType identifierType;

    public ResourceAlreadyExistsException(String identifier, ResourceType resourceType, ResourceIdentifierType identifierType) {
        super("There already exists a " + resourceType.toString() +
                " with " + identifierType.toString() + ": " + identifier);
        this.identifier = identifier;
        this.resourceType = resourceType;
        this.identifierType = identifierType;
    }
}
