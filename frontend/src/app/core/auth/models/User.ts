
export interface UserDataDto {
    id: number;
    cognitoUserId: string;
    email: string;
    displayName?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateUserDto {
    cognitoUserId: string;
    email: string;
}

export interface UpdateUserDto {
    id: number;
    displayName?: string;
}