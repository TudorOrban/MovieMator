import { LogLevel, PassedInitialConfig } from 'angular-auth-oidc-client';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_EArhE3MoU',
    redirectUrl: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    clientId: '21h2ksv965lm901q9vum6ekhll',
    scope: 'phone openid email offline_access',
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    renewTimeBeforeTokenExpiresInSeconds: 30,
    logLevel: LogLevel.Debug,
  }
}
