import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Amplify, ResourcesConfig } from 'aws-amplify';
import { environment } from './environments/environment';


const amplifyConfig: ResourcesConfig = {
    Auth: {
        Cognito: {
            userPoolId: environment.cognitoUserPoolId,
            userPoolClientId: environment.cognitoUserPoolClientId,
        },
    },
};

Amplify.configure(amplifyConfig);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
