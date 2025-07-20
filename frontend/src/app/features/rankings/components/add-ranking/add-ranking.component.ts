import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { UserDataDto } from '../../../user/models/User';
import { Subscription } from 'rxjs';
import { RankingService } from '../../services/ranking.service';
import { AuthService } from '../../../../core/auth/service/auth.service';
import { CreateRankingDto, RankingData, RankingType } from '../../models/Ranking';
import { defaultRankingData } from "../../models/defaultRankingData";
import { ToastType } from '../../../../shared/models/UI';
import { ToastManagerService } from '../../../../shared/common/services/toast-manager.service';
import { Router } from '@angular/router';
import { EnumSelectorComponent } from "../../../../shared/common/components/enum-selector/enum-selector.component";
import { FormsModule } from '@angular/forms';
import { TagInputComponent } from "../../../../shared/common/components/tag-input/tag-input.component";
import { TierListComponent } from "../tier-list/tier-list.component";
import { ImportMoviesDialogComponent } from "./import-movies-dialog/import-movies-dialog.component";
import { MovieSmallDto } from '../../../movies/models/Movie';

@Component({
    selector: 'app-add-ranking',
    imports: [CommonModule, FormsModule, EnumSelectorComponent, TagInputComponent, TierListComponent, ImportMoviesDialogComponent],
    templateUrl: './add-ranking.component.html',
    styleUrl: './add-ranking.component.css'
})
export class AddRankingComponent implements OnInit, OnDestroy {
    ranking: CreateRankingDto = {
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
        private readonly router: Router
    ) {}

    ngOnInit(): void {
        this.subscription.add(
            this.authService.currentUser$.subscribe({
                next: (data) => {
                    if (!data) return;
                    this.ranking.userId = data.id;
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onSubmit(): void {
        this.hasBeenSubmitted.set(true);
        
        if (!this.ranking.userId || !this.ranking.title) {
            console.error("Missing userId or title");
            this.toastService.addToast({ title: "Validation Error", details: "Ranking title and user ID are required.", type: ToastType.ERROR });
            return;
        }
        
        this.rankingService.createRanking(this.ranking).subscribe({
            next: (data) => {
                this.toastService.addToast({ title: "Success", details: "Ranking created successfully.", type: ToastType.SUCCESS });
                this.router.navigate([`/rankings/${data?.id}`]);
            },
            error: (error) => {
                console.error("Failed to create ranking:", error);
                this.toastService.addToast({ title: "Error", details: "An error occurred creating ranking.", type: ToastType.ERROR });
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

    RankingType = RankingType;
}
