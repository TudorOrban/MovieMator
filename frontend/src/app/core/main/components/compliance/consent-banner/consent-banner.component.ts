import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConsentService } from '../../../services/consent.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-consent-banner',
    imports: [CommonModule, RouterModule],
    templateUrl: './consent-banner.component.html',
    styleUrl: './consent-banner.component.css'
})
export class ConsentBannerComponent implements OnInit, OnDestroy {
    consentGiven: boolean = false;
    private consentSubscription: Subscription | undefined;

    constructor(private consentService: ConsentService) {}

    ngOnInit(): void {
        this.consentSubscription = this.consentService.consentGiven$.subscribe({
            next: (given: boolean) => {
                this.consentGiven = given;
            }
        });
    }

    ngOnDestroy(): void {
        this.consentSubscription?.unsubscribe();
    }

    acceptConsent(): void {
        this.consentService.giveConsent();
    }
}
