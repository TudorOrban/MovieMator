import { Component, EventEmitter, Input, Output } from '@angular/core';
import { defaultRankingData, RankingData } from '../../models/Ranking';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretDown, faCaretUp, faGear } from '@fortawesome/free-solid-svg-icons';
import { MovieSearchDto } from '../../../movies/models/Movie';
import { CdkDragDrop, CdkDrag, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-tier-list',
    imports: [CommonModule, FontAwesomeModule, CdkDropList, CdkDrag, CdkDropListGroup],
    templateUrl: './tier-list.component.html',
    styleUrl: './tier-list.component.css'
})
export class TierListComponent {
    @Input() rankingData: RankingData = defaultRankingData;
    @Output() onRankingDataChange = new EventEmitter<RankingData>();
    @Output() onImportMovies = new EventEmitter<void>();

    public static readonly TIER_COLOR_OPTIONS: string[] = [
        "#4A90E2", "#50E3C2", "#F5A623", "#BD10E0", "#9013FE", "#417505", "#F8E71C", "#D0021B", "#8B572A", "#000000", "#9B9B9B", "#4A4A4A", "#7ED321", "#5C7C8A", "#E91E63"
    ];

    // Main drop handler
    drop(event: CdkDragDrop<MovieSearchDto[]>): void {
        if (!this.rankingData?.tierListData) return;

        const previousContainerId = event.previousContainer.id;
        const currentContainerId = event.container.id;

        // Get direct references to the source and target arrays
        const sourceArray = previousContainerId === "available-movies"
            ? this.rankingData.tierListData.availableMovies
            : this.rankingData.tierListData.tierMovies[previousContainerId];

        const targetArray = currentContainerId === "available-movies"
            ? this.rankingData.tierListData.availableMovies
            : this.rankingData.tierListData.tierMovies[currentContainerId];

        if (event.previousContainer === event.container) {
            // Item moved within the same list
            moveItemInArray(sourceArray, event.previousIndex, event.currentIndex);
        } else {
            // Item moved to a different list
            transferArrayItem(
                sourceArray,
                targetArray,
                event.previousIndex,
                event.currentIndex
            );
        }

        this.emitRankingDataChange();
    }

    // Emits the updated ranking data
    private emitRankingDataChange(): void {
        const newTierMovies: Record<string, MovieSearchDto[]> = {};
        for (const tierName in this.rankingData.tierListData!.tierMovies) {
            newTierMovies[tierName] = [...(this.rankingData.tierListData!.tierMovies[tierName] || [])];
        }

        const newAvailableMovies = [...(this.rankingData.tierListData!.availableMovies || [])];

        this.onRankingDataChange.emit({
            ...this.rankingData,
            tierListData: {
                ...this.rankingData.tierListData!,
                tierMovies: newTierMovies,
                availableMovies: newAvailableMovies
            }
        });
    }

    // --- Action Button Handlers ---
    importMovies(): void {
        this.onImportMovies.emit();
    }

    openTierSettings(index: number) {
        console.log("Open settings", index);
    }

    moveTierUp(index: number): void {
        const tierListData = this.rankingData.tierListData;
        if (!tierListData || !tierListData.tiers || index <= 0) return;

        // Swap tiers and update their corresponding movie lists
        const newTiers = [...tierListData.tiers];
        const newTierMovies = { ...tierListData.tierMovies };

        const currentTierName = newTiers[index].name;
        const prevTierName = newTiers[index - 1].name;

        // Swap tier objects in 'tiers' array
        [newTiers[index], newTiers[index - 1]] = [newTiers[index - 1], newTiers[index]];

        // Swap content in 'tierMovies' map (by moving content of original names)
        const tempContent = newTierMovies[prevTierName];
        newTierMovies[prevTierName] = newTierMovies[currentTierName];
        newTierMovies[currentTierName] = tempContent;

        // Update the rankingData object with new references
        this.rankingData.tierListData!.tiers = newTiers;
        this.rankingData.tierListData!.tierMovies = newTierMovies;

        this.emitRankingDataChange();
    }

    moveTierDown(index: number): void {
        const tierListData = this.rankingData.tierListData;
        if (!tierListData || !tierListData.tiers || index >= tierListData.tiers.length - 1) return;

        // Swap tiers and update their corresponding movie lists
        const newTiers = [...tierListData.tiers];
        const newTierMovies = { ...tierListData.tierMovies };

        const currentTierName = newTiers[index].name;
        const nextTierName = newTiers[index + 1].name;

        // Swap tier objects in 'tiers' array
        [newTiers[index], newTiers[index + 1]] = [newTiers[index + 1], newTiers[index]];

        // Swap content in 'tierMovies' map (by moving content of original names)
        const tempContent = newTierMovies[nextTierName];
        newTierMovies[nextTierName] = newTierMovies[currentTierName];
        newTierMovies[currentTierName] = tempContent;

        // Update the rankingData object with new references
        this.rankingData.tierListData!.tiers = newTiers;
        this.rankingData.tierListData!.tierMovies = newTierMovies;

        this.emitRankingDataChange();
    }

    faGear = faGear;
    faCaretUp = faCaretUp;
    faCaretDown = faCaretDown;
}