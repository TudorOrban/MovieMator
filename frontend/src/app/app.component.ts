import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./core/main/components/header/header.component";
import { ToastManagerComponent } from "./shared/common/components/toast-manager/toast-manager.component";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent, ToastManagerComponent],
    templateUrl: './app.component.html',
})
export class AppComponent {
    
}
