import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UIItem } from '../../../models/UI';

@Component({
    selector: 'app-enum-selector',
    imports: [CommonModule, FormsModule, FontAwesomeModule],
    templateUrl: './enum-selector.component.html',
    styleUrls: ['./enum-selector.component.css']
})
export class EnumSelectorComponent {
    @Input() selectedValue: string | undefined;
    @Input() options: UIItem[] = []; 
    @Input() placeholder: string = "Select an option";
    @Output() valueChange = new EventEmitter<string | undefined>(); 

    faTimesCircle = faTimesCircle;

    onSelectChange(value: string | undefined): void {
        const emittedValue = value === "null" ? undefined : value;
        this.valueChange.emit(emittedValue);
    }

    clearSelection(): void {
        this.selectedValue = undefined;
        this.valueChange.emit(undefined);
    }

    isSelectionActive(): boolean {
        return this.selectedValue !== undefined && this.selectedValue !== null;
    }
}