import { Component, Input } from '@angular/core';
import { FallbackState } from '../../models/Fallback';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-error-fallback',
    imports: [CommonModule, RouterModule],
    templateUrl: './error-fallback.component.html',
    styleUrl: './error-fallback.component.css'
})
export class ErrorFallbackComponent {
    @Input() fallbackState!: FallbackState;
}
