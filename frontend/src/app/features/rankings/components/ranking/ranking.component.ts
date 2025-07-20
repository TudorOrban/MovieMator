import { Component, OnDestroy, OnInit } from '@angular/core';
import { RankingDataDto, RankingType } from '../../models/Ranking';
import { Subscription } from 'rxjs';
import { RankingService } from '../../services/ranking.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { faEdit, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TierListComponent } from "../tier-list/tier-list.component";
import { FormatRankingTypePipe } from "../../../../shared/common/pipes/format-ranking-type";

@Component({
    selector: 'app-ranking',
    imports: [CommonModule, FontAwesomeModule, RouterModule, TierListComponent, FormatRankingTypePipe],
    templateUrl: './ranking.component.html',
    styleUrl: './ranking.component.css'
})
export class RankingComponent  implements OnInit, OnDestroy {
    rankingId?: number;
    ranking?: RankingDataDto;
    isLoading: boolean = false;

    private subscription = new Subscription();

    constructor(
        private readonly rankingService: RankingService,
        private readonly route: ActivatedRoute,
    ) {}
    
    ngOnInit(): void {
        this.subscription.add(
            this.route.paramMap.subscribe((params) => {
                this.rankingId = Number(params.get("rankingId"));

                this.loadRanking();
            })
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private loadRanking(): void {
        if (!this.rankingId) return;

        this.isLoading = true;

        this.subscription.add(
            this.rankingService.getRankingById(this.rankingId).subscribe({
                next: (data) => {
                    this.ranking = data;
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error("Error occurred fetching ranking: ", error);
                    this.isLoading = false;
                }
            })
        );
    }
    
    handleRankingDataChange(): void {}

    faEdit = faEdit;
    faSpinner = faSpinner;
    RankingType = RankingType;
}
