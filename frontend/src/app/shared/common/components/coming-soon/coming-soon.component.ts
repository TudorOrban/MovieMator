import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-coming-soon',
    imports: [],
    templateUrl: './coming-soon.component.html',
})
export class ComingSoonComponent {
    @Input() pageName: string = "";
}
