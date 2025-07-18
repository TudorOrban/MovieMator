import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaginatedResults } from '../../../../../shared/models/Search';
import { UserSearchDto } from '../../../models/User';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { faSpinner, faStar, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-search-users-list',
    imports: [CommonModule, RouterModule, FontAwesomeModule],
    templateUrl: './search-users-list.component.html',
})
export class SearchUsersListComponent implements OnInit {
    @Input() users?: PaginatedResults<UserSearchDto>;
    @Input() usersPerRow?: number = 3;
    @Input() isLoading?: boolean = false;
    
    gridColsClass: string = "lg:grid-cols-3";

    ngOnInit(): void {
        this.updateGridClass();
    }

    ngOnChanges(): void {
        this.updateGridClass();
    }

    private updateGridClass(): void {
        switch (this.usersPerRow) {
            case 1:
                this.gridColsClass = "lg:grid-cols-1";
                break;
            case 2:
                this.gridColsClass = "lg:grid-cols-2";
                break;
            case 3:
                this.gridColsClass = "lg:grid-cols-3";
                break;
            case 4:
                this.gridColsClass = "lg:grid-cols-4";
                break;
            case 5:
                this.gridColsClass = "lg:grid-cols-5";
                break;
            default:
                this.gridColsClass = "lg:grid-cols-3";
                break;
        }
    }

    faSpinner = faSpinner;
    faStar = faStar;
    faUserCircle = faUserCircle;
}
