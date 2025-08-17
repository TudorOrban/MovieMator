import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RankingData, TierData, TierListData } from '../../models/Ranking';
import { defaultRankingData } from "../../models/defaultRankingData";
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretDown, faCaretUp, faDownload, faGear } from '@fortawesome/free-solid-svg-icons';
import { CdkDragDrop, CdkDrag, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TierSettingsDialogComponent } from "./tier-settings-dialog/tier-settings-dialog.component";
import { MovieSmallDto } from '../../../movies/models/Movie';
import { v4 as uuidv4 } from 'uuid'; 

@Component({
    selector: 'app-tier-list',
    imports: [CommonModule, FontAwesomeModule, CdkDropList, CdkDrag, CdkDropListGroup, TierSettingsDialogComponent],
    templateUrl: './tier-list.component.html',
    styleUrl: './tier-list.component.css'
})
export class TierListComponent {
    @Input() isEditable: boolean = false;
    @Input() rankingData: RankingData = defaultRankingData;
    @Output() onRankingDataChange = new EventEmitter<RankingData>();
    @Output() onImportMovies = new EventEmitter<void>();

    openedSettingsTierIndex: number | null = null;
    
    isDeleteModeOn: boolean = false;
    toBeRemovedMovieIds: number[] = [];

    readonly TIER_COLOR_OPTIONS: string[] = [
        "#C62828", "#E64A19", "#FF8A65", "#FDD835", "#81C784", "#2E7D32", "#64B5F6", "#1565C0", "#8E24AA", "#D81B60", "#6D4C41", "#616161", "#333333", "#F5F5F5", "#90A4AE"
    ];

    drop(event: CdkDragDrop<MovieSmallDto[]>): void {
        if (!this.isEditable || !this.rankingData?.tierListData) return;

        const previousContainerId = event.previousContainer.id;
        const currentContainerId = event.container.id;

        const newTierMovies = { ...this.rankingData.tierListData.tierMovies };
        const newAvailableMovies = [...(this.rankingData.tierListData.availableMovies || [])];

        const previousTierIdOrName = previousContainerId;
        const currentTierIdOrName = currentContainerId;

        const previousTier = this.rankingData.tierListData.tiers.find(t => t.id === previousTierIdOrName);
        const currentTier = this.rankingData.tierListData.tiers.find(t => t.id === currentTierIdOrName);
        
        const sourceList = previousContainerId === "available-movies"
            ? newAvailableMovies
            : newTierMovies[previousTier?.name || ''];

        const targetList = currentContainerId === "available-movies"
            ? newAvailableMovies
            : newTierMovies[currentTier?.name || ''];


        if (event.previousContainer === event.container) {
            moveItemInArray(sourceList, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                sourceList,
                targetList,
                event.previousIndex,
                event.currentIndex
            );
        }

        const updatedTierListData: TierListData = {
            ...this.rankingData.tierListData,
            tierMovies: newTierMovies,
            availableMovies: newAvailableMovies
        };

        this.updateAndEmitRankingData(updatedTierListData);
    }

    importMovies(): void {
        this.onImportMovies.emit();
    }

    openTierSettings(index: number): void {
        if (!this.isEditable) return;
        this.openedSettingsTierIndex = index;
    }

    confirmTierSettings(tierData: TierData, index: number): void {
        const tierListData = this.rankingData.tierListData;
        if (!tierListData || !tierListData.tiers || !tierListData.tiers[index]) {
            console.warn("Attempted to confirm settings for a non-existent tier or invalid index.");
            return;
        }

        const oldTierName = tierListData.tiers[index].name;
        const newTiers = [...tierListData.tiers];
        newTiers[index] = { ...tierData, id: newTiers[index].id }; 
        
        const newTierMovies = { ...tierListData.tierMovies };

        
        if (oldTierName !== tierData.name) {
            newTierMovies[tierData.name] = newTierMovies[oldTierName] || [];
            delete newTierMovies[oldTierName];
        }

        const updatedTierListData: TierListData = {
            ...tierListData,
            tiers: newTiers,
            tierMovies: newTierMovies,
            availableMovies: tierListData.availableMovies || []
        };

        this.updateAndEmitRankingData(updatedTierListData);
        this.openedSettingsTierIndex = null;
    }

    closeTierSettings(): void {
        this.openedSettingsTierIndex = null;
    }
    
    deleteTier(): void {
        const tierListData = this.rankingData.tierListData;
        if (this.openedSettingsTierIndex === null || !tierListData?.tiers?.[this.openedSettingsTierIndex]) {
            console.warn("No tier selected to clear images from.");
            return;
        }
        if (!tierListData || !tierListData.tiers || !tierListData.tiers[this.openedSettingsTierIndex]) {
            console.warn("Attempted to delete a non-existent tier.");
            return;
        }

        const tierToDeleteName = tierListData.tiers[this.openedSettingsTierIndex].name;
        const newTiers = [...tierListData.tiers];
        newTiers.splice(this.openedSettingsTierIndex, 1);
        const newTierMovies = { ...tierListData.tierMovies };
        delete newTierMovies[tierToDeleteName];
        
        const updatedTierListData: TierListData = {
            ...tierListData,
            tiers: newTiers,
            tierMovies: newTierMovies,
            availableMovies: tierListData.availableMovies || []
        };

        this.updateAndEmitRankingData(updatedTierListData);
        this.openedSettingsTierIndex = null;
    }

    clearTierImages(): void {
        const tierListData = this.rankingData.tierListData;
        if (this.openedSettingsTierIndex === null || !tierListData?.tiers?.[this.openedSettingsTierIndex]) {
            console.warn("No tier selected to clear images from.");
            return;
        }

        const tierToClearName = tierListData.tiers[this.openedSettingsTierIndex].name;
        const moviesToReturnToAvailable = tierListData.tierMovies[tierToClearName] || [];

        const newTierMovies = {
            ...tierListData.tierMovies,
            [tierToClearName]: [] 
        };

        const updatedTierListData: TierListData = {
            ...tierListData,
            tierMovies: newTierMovies,
            availableMovies: [...(tierListData.availableMovies || []), ...moviesToReturnToAvailable]
        };

        this.updateAndEmitRankingData(updatedTierListData);
        this.openedSettingsTierIndex = null;
    }


    addTierRow(addAbove: boolean): void {
        const tierListData = this.rankingData.tierListData;
        const currentTiers = tierListData?.tiers || [];
        const currentTierMovies = tierListData?.tierMovies || {};
        const currentAvailableMovies = tierListData?.availableMovies || [];

        const newTierName = `New Tier ${currentTiers.length + 1}`;
        const newTierColor = this.TIER_COLOR_OPTIONS[Math.floor(Math.random() * this.TIER_COLOR_OPTIONS.length)];
        const newTier: TierData = { id: uuidv4(), name: newTierName, color: newTierColor };

        const newTiers = [...currentTiers];
        const newTierMovies = { ...currentTierMovies };

        const insertIndex = this.openedSettingsTierIndex !== null ?
                           (addAbove ? this.openedSettingsTierIndex : this.openedSettingsTierIndex + 1) :
                           newTiers.length;

        newTiers.splice(insertIndex, 0, newTier);
        newTierMovies[newTier.name] = [];

        const updatedTierListData: TierListData = {
            tiers: newTiers,
            tierMovies: newTierMovies,
            availableMovies: currentAvailableMovies
        };

        this.updateAndEmitRankingData(updatedTierListData);
        this.openedSettingsTierIndex = null;
    }

    moveTierUp(index: number): void {
        const tierListData = this.rankingData.tierListData;
        if (!tierListData || !tierListData.tiers || index <= 0) return;

        const newTiers = [...tierListData.tiers];
        const newTierMovies = { ...tierListData.tierMovies };

        const currentTier = newTiers[index];
        const prevTier = newTiers[index - 1];

        [newTiers[index], newTiers[index - 1]] = [newTiers[index - 1], newTiers[index]];

        const remappedTierMovies: { [tierName: string]: MovieSmallDto[] } = {};
        newTiers.forEach(tier => {
            remappedTierMovies[tier.name] = tierListData.tierMovies[tier.name] || [];
        });

        const updatedTierListData: TierListData = {
            ...tierListData,
            tiers: newTiers,
            tierMovies: remappedTierMovies, 
            availableMovies: tierListData.availableMovies || []
        };

        this.updateAndEmitRankingData(updatedTierListData);
    }

    moveTierDown(index: number): void {
        const tierListData = this.rankingData.tierListData;
        if (!tierListData || !tierListData.tiers || index >= tierListData.tiers.length - 1) return;

        const newTiers = [...tierListData.tiers];

        [newTiers[index], newTiers[index + 1]] = [newTiers[index + 1], newTiers[index]];

        const remappedTierMovies: { [tierName: string]: MovieSmallDto[] } = {};
        newTiers.forEach(tier => {
            remappedTierMovies[tier.name] = tierListData.tierMovies[tier.name] || [];
        });

        const updatedTierListData: TierListData = {
            ...tierListData,
            tiers: newTiers,
            tierMovies: remappedTierMovies,
            availableMovies: tierListData.availableMovies || []
        };

        this.updateAndEmitRankingData(updatedTierListData);
    }

    toggleDeleteMode(): void {
        this.isDeleteModeOn = !this.isDeleteModeOn;
        this.toBeRemovedMovieIds = []; 
    }

    handleNewRemoveMovieId(id: number): void {
        if (this.toBeRemovedMovieIds.includes(id)) {
            this.toBeRemovedMovieIds = this.toBeRemovedMovieIds.filter(movieId => movieId !== id);
        } else {
            this.toBeRemovedMovieIds.push(id);
        }
    }

    clearRemoveMovieIds(): void {
        this.toBeRemovedMovieIds = [];
        this.isDeleteModeOn = false;
    }

    removeAvailableMovies(): void {
        if (!this.isEditable || !this.isDeleteModeOn || this.toBeRemovedMovieIds.length === 0) return;

        const tierListData = this.rankingData.tierListData;
        if (!tierListData) return;

        // Create new objects/arrays for immutable updates
        let newAvailableMovies = [...(tierListData.availableMovies || [])];
        let newTierMovies = { ...tierListData.tierMovies };

        // 1. Filter movies from availableMovies
        newAvailableMovies = newAvailableMovies.filter(movie => 
            !this.toBeRemovedMovieIds.includes(movie.id)
        );

        // 2. Filter movies from each tierMovies list
        for (const tierName in newTierMovies) {
            if (newTierMovies.hasOwnProperty(tierName)) {
                const currentMoviesInTier = newTierMovies[tierName] || [];
                newTierMovies[tierName] = currentMoviesInTier.filter(movie => 
                    !this.toBeRemovedMovieIds.includes(movie.id)
                );
            }
        }

        const updatedTierListData: TierListData = {
            ...tierListData,
            tierMovies: newTierMovies,
            availableMovies: newAvailableMovies
        };

        this.updateAndEmitRankingData(updatedTierListData);
        this.clearRemoveMovieIds();
    }

    trackByTierId(index: number, tier: TierData): string {
        return tier.id;
    }

    trackByMovieId(index: number, movie: MovieSmallDto): number {
        return movie.id;
    }

    private updateAndEmitRankingData(newTierListData: TierListData): void {
        const consistentTierListData: TierListData = {
            ...newTierListData,
            availableMovies: newTierListData.availableMovies || []
        };

        this.rankingData = {
            ...this.rankingData,
            tierListData: consistentTierListData
        };
        this.onRankingDataChange.emit(this.rankingData);
    }


    faGear = faGear;
    faCaretUp = faCaretUp;
    faCaretDown = faCaretDown;
    faDownload = faDownload;
}