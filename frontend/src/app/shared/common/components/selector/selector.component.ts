import { Component, EventEmitter, Input, Output } from '@angular/core';
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
    @Input() defaultItemValue?: string;
    @Output() selectedItemChange = new EventEmitter<UIItem>();

    selectedItem: UIItem | null = null;
    isOpen = false;

    ngOnInit(): void {
        this.selectedItem = this.items.find(item => item.value === this.defaultItemValue) || this.items[0] || null;
        if(this.selectedItem){
            this.selectedItemChange.emit(this.selectedItem);
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
