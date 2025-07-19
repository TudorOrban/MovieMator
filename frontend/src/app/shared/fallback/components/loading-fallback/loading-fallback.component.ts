import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FallbackState } from '../../models/Fallback';

@Component({
    selector: 'app-loading-fallback',
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: './loading-fallback.component.html',
    styleUrl: './loading-fallback.component.css'
})
export class LoadingFallbackComponent {
    @Input() fallbackState!: FallbackState;

    faSpinner = faSpinner;
}
