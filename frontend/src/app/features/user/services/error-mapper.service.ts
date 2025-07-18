import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: "root"
})
export class ErrorMapperService {

    constructor() { }

    mapHttpErrorToMessage(error: HttpErrorResponse): string {
        let errorMessage: string = "An unexpected error occurred. Please try again later.";

        if (error.error instanceof ErrorEvent) {
            errorMessage = `Network Error: ${error.error.message}`;
        } else {
            switch (error.status) {
                case 400: // Bad Request
                    errorMessage = error.error?.message || "Invalid request. Please check your input.";
                    break;
                case 401: // Unauthorized
                    errorMessage = error.error?.message || "You are not authorized to perform this action. Please log in.";
                    break;
                case 403: // Forbidden
                    errorMessage = error.error?.message || "You do not have permission to access this resource.";
                    break;
                case 404: // Not Found
                    errorMessage = error.error?.message || "The requested resource could not be found.";
                    break;
                case 409: // Conflict
                    errorMessage = error.error?.message || "A conflict occurred. The resource might already exist or be in use.";
                    break;
                case 500: // Internal Server Error
                    errorMessage = error.error?.message || "Our servers are experiencing issues. Please try again later.";
                    break;
                case 0: // Network issue/CORS problem/...
                    errorMessage = "Could not connect to the server. Please check your internet connection.";
                    break;
                default:
                    errorMessage = error.error?.message || `Error Code: ${error.status}. An unknown error occurred.`;
                    break;
            }
        }
        return errorMessage;
    }

    mapProfileError(error: HttpErrorResponse): { message: string, isForbidden: boolean } {
        const message = this.mapHttpErrorToMessage(error);
        const isForbidden = error.status === 403;
        return { message, isForbidden };
    }
}