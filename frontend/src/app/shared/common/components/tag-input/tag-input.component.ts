import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-tag-input',
    standalone: true,
    imports: [CommonModule, FormsModule, FontAwesomeModule],
    templateUrl: './tag-input.component.html',
    styleUrls: ['./tag-input.component.css']
})
export class TagInputComponent {
    @Input() label: string = "";
    @Input() id: string = "";
    @Input() placeholder: string = "";
    @Input() currentTags: string[] | undefined;
    @Output() tagsChange = new EventEmitter<string[] | undefined>();

    inputValue: string = "";
    
    faTimesCircle = faTimesCircle;

    ngOnInit(): void {
        this.inputValue = this.currentTags ? this.currentTags.join(", ") : "";
    }

    onInputChange(value: string): void {
        this.inputValue = value;
        this.emitTags();
    }

    emitTags(): void {
        const processedTags = this.inputValue
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        this.tagsChange.emit(processedTags.length > 0 ? processedTags : undefined);
    }

    clearInput(): void {
        this.inputValue = "";
        this.emitTags();
    }

    hasActiveTags(): boolean {
        return this.currentTags !== undefined && this.currentTags !== null &&
               this.currentTags.some(tag => tag.trim().length > 0);
    }
}