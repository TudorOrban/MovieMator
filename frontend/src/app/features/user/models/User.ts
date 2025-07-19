
export interface UserDataDto {
    id: number;
    cognitoUserId: string;
    email: string;
    displayName?: string;
    createdAt?: Date;
    updatedAt?: Date;

    userSettings: UserSettings;
    isProfilePublic: boolean;
}

export interface UserSearchDto {
    id: number;
    cognitoUserId: string;
    email: string;
    displayName?: string;
    createdAt?: Date;
    updatedAt?: Date;

    isProfilePublic: boolean;
}

export interface CreateUserDto {
    cognitoUserId: string;
    email: string;
}

export interface UpdateUserDto {
    id: number;
    displayName?: string;
    userSettings?: UserSettings;
    isProfilePublic: boolean;
}

export interface UserSettings {
    appTheme: string;
    confirmDeletions: boolean;
    defaultMovieSortBy: string;
    moviesPerRow: number;
    defaultStatsTimePeriod: StatsTimePeriodOption;
}

export enum StatsTimePeriodOption {
    LAST_YEAR = "LAST_YEAR",
    LAST_3_MONTHS = "LAST_3_MONTHS",
    LAST_MONTH = "LAST_MONTH"
}

