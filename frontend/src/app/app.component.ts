import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./core/main/components/header/header.component";
import { ToastManagerComponent } from "./shared/common/components/toast-manager/toast-manager.component";
import { ThemeService } from './shared/common/services/theme.service';
import { ConsentBannerComponent } from "./core/main/components/consent-banner/consent-banner.component";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent, ToastManagerComponent, ConsentBannerComponent],
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    
    constructor(private readonly themeService: ThemeService) {}

    ngOnInit(): void {
        
    }
}
