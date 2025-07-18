import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class ConsentService {
    private consentGivenSubject = new BehaviorSubject<boolean>(false);
    consentGiven$ = this.consentGivenSubject.asObservable();

    CONSENT_KEY: string = "user_consent";

    constructor() {
        this.checkConsentStatus();
    }

    private checkConsentStatus(): void {
        const consent = localStorage.getItem(this.CONSENT_KEY);
        this.consentGivenSubject.next(consent === "true");
    }

    giveConsent(): void {
        localStorage.setItem(this.CONSENT_KEY, "true");
        this.consentGivenSubject.next(true);
    }
}