import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-page-selector',
    imports: [CommonModule, FontAwesomeModule],
    
    templateUrl: './page-selector.component.html',
    styleUrl: './page-selector.component.css'
})
export class PageSelectorComponent {
    @Input() currentPage: number = 1;
    @Input() totalCount: number = 0;
    @Input() itemsPerPage: number = 20;
    @Output() pageChanged = new EventEmitter<number>();

    faChevronLeft = faChevronLeft;
    faChevronRight = faChevronRight;

    totalPages: number = 1;
    pages: number[] = [];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["totalCount"] || changes["itemsPerPage"]) {
            this.calculateTotalPages();
            this.generatePageNumbers();
        }
        if (changes["currentPage"]) {
            this.generatePageNumbers();
        }
    }

    private calculateTotalPages(): void {
        this.totalPages = Math.ceil(this.totalCount / this.itemsPerPage);
        if (this.totalPages === 0) {
            this.totalPages = 1;
        }
    }

    private generatePageNumbers(): void {
        this.pages = [];
        const maxPagesToShow = 5;
        let startPage: number, endPage: number;

        if (this.totalPages <= maxPagesToShow) {
            startPage = 1;
            endPage = this.totalPages;
        } else {
            const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
            const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;
            if (this.currentPage <= maxPagesBeforeCurrentPage) {
                startPage = 1;
                endPage = maxPagesToShow;
            } else if (this.currentPage + maxPagesAfterCurrentPage >= this.totalPages) {
                startPage = this.totalPages - maxPagesToShow + 1;
                endPage = this.totalPages;
            } else {
                startPage = this.currentPage - maxPagesBeforeCurrentPage;
                endPage = this.currentPage + maxPagesAfterCurrentPage;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            this.pages.push(i);
        }
    }

    goToPage(page: number): void {
        if (page < 1 || page > this.totalPages || page === this.currentPage) {
            return;
        }
        this.pageChanged.emit(page);
    }

    goToPreviousPage(): void {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    }

    goToNextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.goToPage(this.currentPage + 1);
        }
    }
}