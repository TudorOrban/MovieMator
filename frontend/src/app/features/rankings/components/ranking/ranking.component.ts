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
import { FallbackState, initialFallbackState } from '../../../../shared/fallback/models/Fallback';
import { LoadingFallbackComponent } from "../../../../shared/fallback/components/loading-fallback/loading-fallback.component";
import { ErrorFallbackComponent } from "../../../../shared/fallback/components/error-fallback/error-fallback.component";
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorMapperService } from '../../../user/services/error-mapper.service';
import { AuthService } from '../../../../core/auth/service/auth.service';
import { UserDataDto } from '../../../user/models/User';

@Component({
    selector: 'app-ranking',
    imports: [CommonModule, FontAwesomeModule, RouterModule, TierListComponent, FormatRankingTypePipe, LoadingFallbackComponent, ErrorFallbackComponent],
    templateUrl: './ranking.component.html',
    styleUrl: './ranking.component.css'
})
export class RankingComponent  implements OnInit, OnDestroy {
    rankingId: number | null = null;
    ranking: RankingDataDto | null = null;
    currentUser: UserDataDto | null = null;
    
    fallbackState: FallbackState = initialFallbackState;
    
    private subscription = new Subscription();

    constructor(
        private readonly rankingService: RankingService,
        private readonly authService: AuthService,
        private readonly errorMapperService: ErrorMapperService,
        private readonly route: ActivatedRoute,
    ) {}
    
    ngOnInit(): void {
        this.subscription.add(
            this.route.paramMap.subscribe((params) => {
                this.rankingId = Number(params.get("rankingId"));

                this.loadCurrentUser();
                this.loadRanking();
            })
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private loadCurrentUser(): void {
        this.subscription.add(
            this.authService.currentUser$.subscribe({
                next: (data: UserDataDto | null) => {
                    this.currentUser = data;
                }
            })
        );
    }

    private loadRanking(): void {
        if (!this.rankingId) return;

        this.fallbackState.isLoading = true;

        this.subscription.add(
            this.rankingService.getRankingById(this.rankingId).subscribe({
                next: (data) => {
                    this.ranking = data;
                    this.fallbackState.isLoading = false;
                },
                error: (error) => this.handleAPIError(error)
            })
        );
    }

    private handleAPIError(error: HttpErrorResponse) {
        console.error("Error fetching ranking: ", error);
        const { message, isForbidden } = this.errorMapperService.mapProfileError(error);
        this.fallbackState = { isLoading: false, errorMessage: message, isForbidden: isForbidden };
    }
    
    handleRankingDataChange(): void {}

    faEdit = faEdit;
    faSpinner = faSpinner;
    RankingType = RankingType;
}
