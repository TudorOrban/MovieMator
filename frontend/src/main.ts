import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Amplify, ResourcesConfig } from 'aws-amplify';


const amplifyConfig: ResourcesConfig = {
    Auth: {
        Cognito: {
            userPoolId: "us-east-1_EArhE3MoU",
            userPoolClientId: "21h2ksv965lm901q9vum6ekhll",
            identityPoolId: "us-east-1:dummy-identity-pool-id",
        },
    },
};

Amplify.configure(amplifyConfig);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
