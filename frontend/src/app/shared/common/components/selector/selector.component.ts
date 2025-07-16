import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UIItem } from '../../../models/UI';

@Component({
    selector: 'app-selector',
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: './selector.component.html',
})
export class SelectorComponent {
    @Input() items: UIItem[] = [];
    @Input() selectedValue?: string | number;
    @Output() selectedItemChange = new EventEmitter<UIItem>();

    selectedItem: UIItem | null = null;
    isOpen = false;

    
    ngOnInit(): void {
        this.updateSelectedItem(this.selectedValue);
        if(this.selectedItem){
            this.selectedItemChange.emit(this.selectedItem);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["selectedValue"] && changes["selectedValue"].currentValue !== changes["selectedValue"].previousValue) {
            this.updateSelectedItem(changes["selectedValue"].currentValue);
        }
        if (changes["items"]) {
             this.updateSelectedItem(this.selectedValue);
        }
    }

    private updateSelectedItem(value: string | number | undefined): void {
        if (value !== undefined && value !== null) {
            this.selectedItem = this.items.find(item => item.value === value) || null;
        } else {
            this.selectedItem = this.items.length > 0 ? this.items[0] : null;
        }

        if (!this.selectedItem && this.items.length > 0 && (value === undefined || value === null)) {
            this.selectedItem = this.items[0];
        }
    }


    toggleDropdown(): void {
        this.isOpen = !this.isOpen;
    }

    selectItem(item: UIItem): void {
        this.selectedItem = item;
        this.selectedItemChange.emit(item);
        this.isOpen = false;
    }
}
