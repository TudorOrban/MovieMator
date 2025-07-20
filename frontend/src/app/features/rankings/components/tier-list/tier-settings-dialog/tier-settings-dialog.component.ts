import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave, faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-tier-settings-dialog',
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: './tier-settings-dialog.component.html',
    styleUrl: './tier-settings-dialog.component.css'
})
export class TierSettingsDialogComponent {
    @Input() tierColorOptions: string[] = [];
    @Input() selectedColor: string = "";
    @Output() onColorChange = new EventEmitter<string>();
    @Output() onDeleteRow = new EventEmitter<void>();

    selectColor(index: number): void {
        const correspColor = this.tierColorOptions?.[index];
        if (!correspColor) return;
        this.selectedColor = correspColor;
        console.log("S", this.selectedColor);
        this.onColorChange.emit(correspColor);
    }

    faXmark = faXmark;
    faSave = faSave;
}
