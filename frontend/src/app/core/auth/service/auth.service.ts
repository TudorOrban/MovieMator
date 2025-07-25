import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, filter, switchMap, take } from "rxjs";
import { signUp, confirmSignUp, signIn, SignInOutput, fetchAuthSession, signOut, getCurrentUser, resetPassword, confirmResetPassword, updatePassword } from "aws-amplify/auth";
import { UserService } from "../../../features/user/services/user.service";
import { CreateUserDto, UserDataDto } from "../../../features/user/models/User";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private _isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isAuthenticated$: Observable<boolean> = this._isAuthenticatedSubject.asObservable();

    private _cognitoUserDataSubject: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
    cognitoUserData$: Observable<any | null> = this._cognitoUserDataSubject.asObservable();
    
    private _accessTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
    accessToken$: Observable<string | null> = this._accessTokenSubject.asObservable(); 
    
    private readonly userService = inject(UserService);

    private _currentUserSubject: BehaviorSubject<UserDataDto | null> = new BehaviorSubject<UserDataDto | null>(null);
    currentUser$: Observable<UserDataDto | null> = this._currentUserSubject.asObservable();

    private _isAuthCheckComplete: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isAuthCheckComplete$: Observable<boolean> = this._isAuthCheckComplete.asObservable();
    
    constructor() {
        this.loadUserIfAuthenticated();
    }

    setCurrentUser(user: UserDataDto | null): void {
        this._currentUserSubject.next(user);
    }

    async signUp(email: string, password: string): Promise<any> {
        try {
            const result = await signUp({
                username: email,
                password: password,
                options: { userAttributes: { email: email } }
            });
            return result;
        } catch (error: any) {
            console.error("AuthService: SignUp error:", error);
            throw error;
        }
    }

    async confirmSignUp(email: string, code: string): Promise<any> {
        try {
            const result = await confirmSignUp({ username: email, confirmationCode: code });
            return result;
        } catch (error: any) {
            console.error("AuthService: Confirm SignUp error:", error);
            throw error;
        }
    }

    async login(email: string, password: string): Promise<any> {
        try {
            const result = await signIn({ username: email, password: password });
            if (result.isSignedIn) {
                await this.updateAmplifyAuthStates();
                await this.runLoginChecks(result, email);
            }
            return result;
        } catch (error: any) {
            console.error("AuthService: Direct Login error:", error);
            throw error;
        }
    }

    async forgotPassword(email: string): Promise<void> {
        try {
            await resetPassword({ username: email });
        } catch (error: any) {
            console.error("AuthService: Forgot password error:", error);
            throw error;
        }
    }

    async confirmNewPassword(email: string, confirmationCode: string, newPassword: string): Promise<void> {
        try {
            await confirmResetPassword({
                username: email,
                confirmationCode: confirmationCode,
                newPassword: newPassword
            });
        } catch (error: any) {
            console.error("AuthService: Confirm new password error:", error);
            throw error;
        }
    }

    async changeUserPassword(oldPassword: string, newPassword: string): Promise<void> {
        try {
            await updatePassword({ oldPassword, newPassword });
        } catch (error: any) {
            console.error("AuthService: Change password error:", error);
            throw error;
        }
    }

    async logout(): Promise<void> {
        try {
            await signOut();
            this.clearAllAuthStates();
        } catch (error: any) {
            console.error("AuthService: Error during logout:", error);
            this.clearAllAuthStates();
        }
    }

    private async loadUserIfAuthenticated(): Promise<void> {
        try {
            const currentUser = await getCurrentUser();
            const authSession = await fetchAuthSession();

            if (currentUser && authSession.userSub && authSession.tokens?.accessToken) {
                this._isAuthenticatedSubject.next(true);
                this._cognitoUserDataSubject.next(currentUser);
                this._accessTokenSubject.next(authSession.tokens.accessToken.toString());
                await this.loadCurrentUser(authSession.userSub);
            } else {
                this.clearAllAuthStates();
            }
        } catch (e: any) {
            this.clearAllAuthStates();
        } finally {
            this._isAuthCheckComplete.next(true);
        }
    }

    private async updateAmplifyAuthStates(): Promise<void> {
        try {
            const currentUser = await getCurrentUser();
            const authSession = await fetchAuthSession();
            this._isAuthenticatedSubject.next(true);
            this._cognitoUserDataSubject.next(currentUser);
            this._accessTokenSubject.next(authSession.tokens?.accessToken?.toString() || null);
        } catch (e) {
            console.error("AuthService: Error updating Amplify auth states:", e);
            this.clearAllAuthStates();
        }
    }

    private async runLoginChecks(result: SignInOutput, email: string): Promise<any> {
        if (!result.isSignedIn) {
            return;
        }

        const session = await fetchAuthSession();
        const cognitoUserId = session.userSub;

        if (!cognitoUserId) {
            console.error("AuthService: Missing Cognito User Id in SignIn response");
            return;
        }

        this.userService.getUserByCognitoUserId(cognitoUserId).subscribe({
            next: (data) => {
                if (data) {
                    this._currentUserSubject.next(data);
                } else {
                    this.createDatabaseUser(cognitoUserId, email);
                }
            },
            error: (error) => {
                this.createDatabaseUser(cognitoUserId, email); 
            }
        });
    }

    private async createDatabaseUser(cognitoUserId: string, email: string): Promise<void> {
        const userDto: CreateUserDto = { cognitoUserId: cognitoUserId, email: email };
        this.userService.createUser(userDto).pipe(take(1)).subscribe({
            next: (data) => this._currentUserSubject.next(data),
            error: (error) => console.error("AuthService: Error creating user:", error)
        });
    }

    private loadCurrentUser(cognitoUserId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.userService.getUserByCognitoUserId(cognitoUserId).subscribe({
                next: (userData) => {
                    this._currentUserSubject.next(userData);
                    resolve();
                },
                error: (err) => {
                    console.error("AuthService: Failed to load current app user:", err);
                    this._currentUserSubject.next(null);
                    this.logout();
                    reject(err);
                }
            });
        });
    }

    private clearAllAuthStates(): void {
        this._isAuthenticatedSubject.next(false);
        this._cognitoUserDataSubject.next(null);
        this._accessTokenSubject.next(null);
        this._currentUserSubject.next(null);
    }
}