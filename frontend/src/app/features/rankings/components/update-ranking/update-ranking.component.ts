import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { RankingService } from '../../services/ranking.service';
import { AuthService } from '../../../../core/auth/service/auth.service';
import { CreateRankingDto, RankingData, RankingDataDto, RankingType, UpdateRankingDto } from '../../models/Ranking';
import { defaultRankingData } from "../../models/defaultRankingData";
import { ToastType } from '../../../../shared/models/UI';
import { ToastManagerService } from '../../../../shared/common/services/toast-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EnumSelectorComponent } from "../../../../shared/common/components/enum-selector/enum-selector.component";
import { FormsModule } from '@angular/forms';
import { TagInputComponent } from "../../../../shared/common/components/tag-input/tag-input.component";
import { TierListComponent } from "../tier-list/tier-list.component";
import { MovieSmallDto } from '../../../movies/models/Movie';
import { ImportMoviesDialogComponent } from '../add-ranking/import-movies-dialog/import-movies-dialog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-update-ranking',
    imports: [CommonModule, FontAwesomeModule, FormsModule, EnumSelectorComponent, TagInputComponent, TierListComponent, ImportMoviesDialogComponent],
    templateUrl: './update-ranking.component.html',
    styleUrl: './update-ranking.component.css'
})
export class UpdateRankingComponent implements OnInit, OnDestroy {
    rankingId: number | null = null;
    existingRanking: RankingDataDto | null = null;
    ranking: UpdateRankingDto = {
        id: -1,
        userId: -1,
        title: "",
        rankingType: RankingType.TIER_LIST,
        rankingData: defaultRankingData
    }
    hasBeenSubmitted = signal(false);

    isImportMoviesDialogOpen = signal(false);

    rankingTypeOptions: { label: string, value: RankingType }[] = [
        { label: "Tier List", value: RankingType.TIER_LIST },
        { label: "List", value: RankingType.LIST }
    ];

    private subscription: Subscription = new Subscription();

    constructor(
        private readonly rankingService: RankingService,
        private readonly authService: AuthService,
        private readonly toastService: ToastManagerService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            this.rankingId = Number(params.get("rankingId"));
            this.loadRanking();
        });
        this.addUserSubscription();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private loadRanking(): void {
        if (!this.rankingId) return;

        this.rankingService.getRankingById(this.rankingId).subscribe({
            next: (data: RankingDataDto) => {
                this.existingRanking = data;
                this.ranking = data;
            },
            error: (error) => {
                console.error("Error occurred fetching ranking: ", error);
            }
        });
    }

    private addUserSubscription(): void {
        this.subscription = this.authService.currentUser$.subscribe({
            next: (data) => {
                if (!data) {
                    return;
                }
                this.ranking.userId = data?.id;
            },
            error: (error) => {
                console.error("Error getting current user: ", error);
                this.router.navigate(["/signup"]);
            }
        });
    }

    onSubmit(): void {
        this.hasBeenSubmitted.set(true);
        
        if (!this.ranking.userId || !this.ranking.title) {
            console.error("Missing userId or title");
            this.toastService.addToast({ title: "Validation Error", details: "Ranking title and user ID are required.", type: ToastType.ERROR });
            return;
        }
        
        this.rankingService.updateRanking(this.ranking).subscribe({
            next: (data) => {
                this.toastService.addToast({ title: "Success", details: "Ranking updated successfully.", type: ToastType.SUCCESS });
            },
            error: (error) => {
                console.error("Failed to update ranking:", error);
                this.toastService.addToast({ title: "Error", details: "An error occurred updating ranking.", type: ToastType.ERROR });
            }
        });
    }

    handleRankingTypeChange(value?: string): void {
        if (!value) {
            return;
        }
        this.ranking.rankingType = RankingType[value as keyof typeof RankingType];
    }

    handleTagsChange(tags: string[] | undefined): void {
        this.ranking.tags = tags;
    }

    handleRankingDataChange(data: RankingData): void {
        this.ranking.rankingData = data;
    }

    handleImportMoviesRequest(): void {
        this.isImportMoviesDialogOpen.set(true);
    }

    handleMoviesImported(importedMovies: MovieSmallDto[]): void {
        if (!this.ranking.rankingData.tierListData) return;
        this.ranking.rankingData.tierListData.availableMovies = importedMovies;
        this.isImportMoviesDialogOpen.set(false);
    }

    closeImportMoviesDialog(): void {
        this.isImportMoviesDialogOpen.set(false);
    }

    faSave = faSave;
    RankingType = RankingType;
}
