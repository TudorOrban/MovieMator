import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-public-profile-consent',
    imports: [CommonModule],
    templateUrl: './public-profile-consent.component.html',
    styleUrl: './public-profile-consent.component.css'
})
export class PublicProfileConsentComponent {
    @Output() confirmed = new EventEmitter<boolean>();
    @Output() cancelled = new EventEmitter<boolean>();

    onConfirm(): void {
        this.confirmed.emit(true);
    }

    onCancel(): void {
        this.cancelled.emit(true);
    }
}
