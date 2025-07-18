import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaginatedResults, SearchParams } from '../../../../shared/models/Search';
import { UserSearchDto } from '../../models/User';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../../core/auth/service/auth.service';
import { Subscription } from 'rxjs';
import { PageSelectorComponent } from "../../../../shared/common/components/page-selector/page-selector.component";
import { UserSettings } from '../../../user/models/User';
import { SearchUsersHeaderComponent } from './search-users-header/search-users-header.component';
import { SearchUsersListComponent } from './search-users-list/search-users-list.component';

@Component({
    selector: 'app-search-public-users',
    imports: [CommonModule, FontAwesomeModule, SearchUsersHeaderComponent, SearchUsersListComponent, PageSelectorComponent],
    templateUrl: './search-public-users.component.html',
})
export class SearchPublicUsersComponent implements OnInit, OnDestroy {
    users?: PaginatedResults<UserSearchDto>;
    userId?: number;
    userSettings?: UserSettings;
    searchParams: SearchParams = {
        searchText: "",
        sortBy: "createdAt",
        isAscending: false,
        page: 1,
        itemsPerPage: 27
    };
    isLoading: boolean = false;

    isDeleteModeOn: boolean = false;
    toBeDeletedUserIds: number[] = [];

    private subscription: Subscription = new Subscription();

    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

    ngOnInit() {
        this.subscription = this.authService.currentUser$.subscribe({
            next: (data) => {
                this.userId = data?.id;
                this.userSettings = data?.userSettings;
                this.searchUsers();
            },
            error: (error) => {
                console.error("Error getting current user: ", error);
            }
        })
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    searchUsers(): void {
        if (!this.userId) return;

        this.isLoading = true;

        this.userService.searchPublicUsers(this.searchParams).subscribe({
            next: (data) => {
                this.users = data;
                this.isLoading = false;
            },
            error: (error) => {
                console.error("Error searching users: ", error);
                this.isLoading = false;
            }
        });
    }

    handleSortOptionsChange(): void {
        this.searchParams.page = 1;
    }

    handlePageChange(newPage: number): void {
        this.searchParams.page = newPage;
        this.searchUsers();
    }

    toggleDeleteMode(): void {
        this.isDeleteModeOn = !this.isDeleteModeOn;
        this.toBeDeletedUserIds = []; 
    }
}
