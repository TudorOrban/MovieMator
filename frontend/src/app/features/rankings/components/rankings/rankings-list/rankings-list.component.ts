import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaginatedResults } from '../../../../../shared/models/Search';
import { RankingSearchDto } from '../../../models/Ranking';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { faSpinner, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-rankings-list',
    imports: [CommonModule, RouterModule, FontAwesomeModule],
    templateUrl: './rankings-list.component.html',
})
export class RankingsListComponent implements OnInit {
    @Input() rankings: PaginatedResults<RankingSearchDto> | null = null;
    @Input() rankingsPerRow?: number = 3;
    @Input() isDeleteModeOn?: boolean = false;
    @Input() isLoading?: boolean = false;
    @Output() onNewRankingId = new EventEmitter<number>();
    
    gridColsClass: string = "lg:grid-cols-3";

    ngOnInit(): void {
        this.updateGridClass();
    }

    handleCheckboxChange(rankingId: number): void {
        this.onNewRankingId.emit(rankingId);
    }

    ngOnChanges(): void {
        this.updateGridClass();
    }

    private updateGridClass(): void {
        switch (this.rankingsPerRow) {
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
}
