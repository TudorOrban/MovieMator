import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faArrowUpWideShort, faArrowDownShortWide, faTrash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { PageSearchConfiguration, SearchParams } from '../../../../../shared/models/Search';
import { pagesSearchConfiguration } from '../../../../../core/main/config/pagesStandardConfig';
import { UIItem } from '../../../../../shared/models/UI';
import { RouterModule } from '@angular/router';
import { SearchInputComponent } from "../../../../../shared/common/components/search-input/search-input.component";
import { SelectorComponent } from "../../../../../shared/common/components/selector/selector.component";
import { PublicUserDataDto } from '../../../../user/models/User';

@Component({
    selector: 'app-rankings-header',
    imports: [CommonModule, RouterModule, FontAwesomeModule, SearchInputComponent, SelectorComponent],
    templateUrl: './rankings-header.component.html',
    styleUrl: './rankings-header.component.css'
})
export class RankingsHeaderComponent {
    @Input() isCurrentUserPage: boolean = false;
    @Input() currentRouteUser: PublicUserDataDto | null = null;
    @Input() searchParams!: SearchParams;
    @Input() totalCount?: number = 0;
    @Input() isDeleteModeOn: boolean = false;
    @Output() searchParamsChanged = new EventEmitter<void>();
    @Output() sortOptionsChanged = new EventEmitter<void>();
    @Output() deleteModeToggled = new EventEmitter<void>();
    @Output() onDeleteRankings = new EventEmitter<void>();
    @Output() cancelDeleteRankings = new EventEmitter<void>();

    searchConfig: PageSearchConfiguration = pagesSearchConfiguration.pagesConfig["/rankings"];

    handleSearchTextChange(searchText: string): void {
        this.searchParams.searchText = searchText;
        this.searchParamsChanged.emit();
    }

    handleSortOptionChange(item: UIItem): void {
        this.searchParams.sortBy = item?.value;
        this.sortOptionsChanged.emit();
        this.searchParamsChanged.emit();
    }

    handleToggleIsAscending(): void {
        this.searchParams.isAscending = !this.searchParams.isAscending;
        this.searchParamsChanged.emit();
    }

    handleToggleDeleteMode(): void {
        this.deleteModeToggled.emit();
    }

    handleCancelDeleteRankings(): void {
        this.cancelDeleteRankings.emit();
    }

    deleteRankings(): void {
        this.onDeleteRankings.emit();
    }

    faPlus = faPlus;
    faArrowUpWideShort = faArrowUpWideShort;
    faArrowDownShortWide = faArrowDownShortWide;
    faTrash = faTrash;
    faCheck = faCheck;
    faTimes = faTimes;
}
