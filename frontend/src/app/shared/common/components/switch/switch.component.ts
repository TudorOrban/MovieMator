import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-switch',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './switch.component.html',
    styleUrls: ['./switch.component.css']
})
export class SwitchComponent {
    @Input() checked: boolean = false;
    @Input() disabled: boolean = false;
    @Input() id: string = "";
    @Output() checkedChange = new EventEmitter<boolean>();

    @HostListener("click")
    onClick(): void {
        if (!this.disabled) {
            this.checked = !this.checked;
            this.checkedChange.emit(this.checked);
        }
    }
}