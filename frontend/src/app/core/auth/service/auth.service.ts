import { inject, Injectable } from "@angular/core";
import { AuthenticatedResult, LoginResponse, OidcSecurityService } from "angular-auth-oidc-client";
import { Observable } from "rxjs";
import { signUp, confirmSignUp, signIn } from "aws-amplify/auth"; 
import { Amplify } from "aws-amplify";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private readonly oidcSecurityService = inject(OidcSecurityService);

    isAuthenticated$: Observable<AuthenticatedResult> = this.oidcSecurityService.isAuthenticated$;
    userData$: Observable<any> = this.oidcSecurityService.userData$;
    accessToken$: Observable<string> = this.oidcSecurityService.getAccessToken();

    constructor() {
        this.oidcSecurityService.checkAuth().subscribe((response: LoginResponse) => {
            const { isAuthenticated, userData, accessToken, idToken } = response;
            console.log("AuthService: App is authenticated:", isAuthenticated);
            console.log("AuthService: User Data:", userData);
            console.log("AuthService: Access Token:", accessToken);
            console.log("AuthService: ID Token:", idToken);
        });
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
            console.log("AuthService: Confirm SignUp successful:", result);
            return result;
        } catch (error: any) {
            console.error("AuthService: Confirm SignUp error:", error);
            throw error;
        }
    }
    
    async login(email: string, password: string): Promise<any> {
        try {
            const result = await signIn({ username: email, password: password });
            console.log("AuthService: Direct Login successful:", result);
            return result;
        } catch (error: any) {
            console.error("AuthService: Direct Login error:", error);
            throw error;
        }
    }

    redirectToHostedLogin(): void {
        this.oidcSecurityService.authorize();
    }

    logout(): void {
        this.oidcSecurityService.logoff();
    }
}