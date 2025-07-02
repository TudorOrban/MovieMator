import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faExclamation, faInfo, faXmark, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ToastItem, ToastType } from '../../../models/UI';

@Component({
    selector: 'app-toast',
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.css'
})
export class ToastComponent {
    @Input() item!: ToastItem;
    @Output() close = new EventEmitter<number>(); 

    onClose(): void {
        this.close.emit(this.item.id);
    }

    getColorByToastType(): string {
        switch (this.item.type) {
            case ToastType.SUCCESS:
                return "bg-green-700";
            case ToastType.ERROR:
                return "bg-red-700";
            case ToastType.WARNING:
                return "bg-yellow-700";
            case ToastType.INFO:
                return "bg-gray-700";
        }
    }

    getIconByToastType(): IconDefinition {
        switch (this.item.type) {
            case ToastType.SUCCESS:
                return faCheck;
            case ToastType.ERROR:
                return faXmark;
            case ToastType.WARNING:
                return faExclamation;
            case ToastType.INFO:
                return faInfo;
        }
    }

    faXmark = faXmark;
}
