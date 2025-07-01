package com.moviemator.shared.error.types;

public class UnavailableServiceException extends RuntimeException {

    public UnavailableServiceException(MovieMatorServiceType serviceType) {
        super("Unavailable Hilbert Service: " + serviceType.toString());
    }
}
