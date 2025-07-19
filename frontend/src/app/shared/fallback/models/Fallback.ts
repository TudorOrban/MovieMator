
export interface FallbackState {
    isLoading: boolean;
    errorMessage: string | null;

    isForbidden: boolean;
}

export const initialFallbackState: FallbackState = {
    isLoading: false,
    isForbidden: false,
    errorMessage: null,
};