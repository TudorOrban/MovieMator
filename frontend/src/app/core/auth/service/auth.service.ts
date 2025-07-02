import { inject, Injectable } from "@angular/core";
import { AuthenticatedResult, LoginResponse, OidcSecurityService } from "angular-auth-oidc-client";
import { BehaviorSubject, Observable } from "rxjs";
import { signUp, confirmSignUp, signIn, SignInOutput, fetchAuthSession, signOut, getCurrentUser } from "aws-amplify/auth"; 
import { UserService } from "./user.service";
import { CreateUserDto, UserDataDto } from "../models/User";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private readonly oidcSecurityService = inject(OidcSecurityService);

    isAuthenticated$: Observable<AuthenticatedResult> = this.oidcSecurityService.isAuthenticated$;
    userData$: Observable<any> = this.oidcSecurityService.userData$;
    accessToken$: Observable<string> = this.oidcSecurityService.getAccessToken();

    private _currentUserSubject: BehaviorSubject<UserDataDto | undefined> = new BehaviorSubject<UserDataDto | undefined>(undefined);
    currentUser$: Observable<UserDataDto | undefined> = this._currentUserSubject.asObservable();

    constructor(private readonly userService: UserService) {
        this.oidcSecurityService.checkAuth().subscribe((response: LoginResponse) => {
            const { isAuthenticated, userData, accessToken, idToken } = response;
            console.log("Response: ", response);
            
            this.checkAmplifyAuthState(); // Call the diagnostic method here
            
            if (isAuthenticated && userData) {
                this.loadCurrentUser(userData.sub);
            } else {
                this._currentUserSubject.next(undefined);
            }
        });
    }

    private async checkAmplifyAuthState(): Promise<void> {
        try {
            const currentUser = await getCurrentUser();
            console.log("AuthService: DIAGNOSTIC - Amplify's getCurrentUser() result:", currentUser);
            const authSession = await fetchAuthSession();
            console.log("AuthService: DIAGNOSTIC - Amplify's fetchAuthSession() result:", authSession);
        } catch (e: any) {
            console.log("AuthService: DIAGNOSTIC - Amplify's Auth state check failed (expected if not signed in):", e.name, e.message);
        }
    }

    async signUp(email: string, password: string): Promise<any> {
        try {
            const result = await signUp({
                username: email,
                password: password,
                options: {
                    userAttributes: {
                        email: email
                    }
                }
            });
            console.log("AuthService: SignUp successful:", result);
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
            
            await this.runLoginChecks(result, email);

            return result;
        } catch (error: any) {
            console.error("AuthService: Direct Login error:", error);
            throw error;
        }
    }

    private async runLoginChecks(result: SignInOutput, email: string): Promise<any> {
        if (result.nextStep) {
            console.log("AuthService: Next step required:", result.nextStep.signInStep);
        }
        if (!result.isSignedIn) return;

        const session = await fetchAuthSession();
        const cognitoUserId = session.userSub;

        if (!cognitoUserId) {
            console.error("Missing Cognito User Id in SignIn response");
            return;
        }

        this.userService.getUserByCognitoUserId(cognitoUserId).subscribe({
            next: (data) => {
                if (data) {
                    console.log("Found user already: ", data.id);
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

    private async createDatabaseUser(cognitoUserId: string, email: string): Promise<any> {
        const userDto: CreateUserDto = {
            cognitoUserId: cognitoUserId,
            email: email
        };

        this.userService.createUser(userDto).subscribe({
            next: (data) => {
                console.log("User created successfully: ", data.id);
                this._currentUserSubject.next(data);
            },
            error: (error) => {
                console.error("Error creating user: ", error);
            }
        });
    }

    redirectToHostedLogin(): void {
        this.oidcSecurityService.authorize();
    }

    async logout(): Promise<void> {
        await signOut();
        this._currentUserSubject.next(undefined);
        this.oidcSecurityService.logoff();
    }

    private loadCurrentUser(cognitoUserId: string): void {
        console.log("SDA");
        this.userService.getUserByCognitoUserId(cognitoUserId).subscribe({
            next: (userData) => {
                this._currentUserSubject.next(userData);
                console.log("AuthService: Current app user loaded:", userData);
            },
            error: (err) => {
                console.error("AuthService: Failed to load current app user:", err);
                this._currentUserSubject.next(undefined);
            }
        });
    }
}