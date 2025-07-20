import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave, faXmark } from '@fortawesome/free-solid-svg-icons';
import { TierData } from '../../../models/Ranking';

@Component({
    selector: 'app-tier-settings-dialog',
    imports: [CommonModule, FontAwesomeModule, FormsModule],
    templateUrl: './tier-settings-dialog.component.html',
    styleUrl: './tier-settings-dialog.component.css'
})
export class TierSettingsDialogComponent {
    @Input() tierColorOptions: string[] = [];
    @Input() selectedColor!: string;
    @Input() tierName: string = "";    
    @Output() requestConfirm = new EventEmitter<TierData>();
    @Output() requestClose = new EventEmitter<void>();
    @Output() requestDeleteTier = new EventEmitter<void>();
    @Output() requestClearImages = new EventEmitter<void>();
    @Output() requestAddRowAbove = new EventEmitter<boolean>(); // false means below

    hasBeenSubmitted = signal(false);

    selectColor(index: number): void {
        const correspColor = this.tierColorOptions?.[index];
        if (!correspColor) return;

        this.selectedColor = correspColor;
    }

    confirmSettings(): void {
        this.requestConfirm.emit({ name: this.tierName, color: this.selectedColor });
    }

    closeSettings(): void {
        this.requestClose.emit();
    }

    deleteTier(): void {
        this.requestDeleteTier.emit();
    }

    clearTierImages(): void {
        this.requestClearImages.emit();
    }

    addRowAbove(above: boolean): void {
        this.requestAddRowAbove.emit(above);
    }

    faXmark = faXmark;
    faSave = faSave;
}
