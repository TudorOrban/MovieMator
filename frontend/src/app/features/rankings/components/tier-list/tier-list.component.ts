import { Component, EventEmitter, Input, Output } from '@angular/core';
import { defaultRankingData, RankingData } from '../../models/Ranking';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../../movies/services/movie.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretDown, faCaretUp, faGear } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-tier-list',
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: './tier-list.component.html',
    styleUrl: './tier-list.component.css'
})
export class TierListComponent {
    @Input() rankingData?: RankingData = defaultRankingData;
    @Output() onRankingDataChange = new EventEmitter<RankingData>();

    public static readonly TIER_COLOR_OPTIONS: string[] = [
        "#4A90E2", "#50E3C2", "#F5A623", "#BD10E0", "#9013FE", "#417505", "#F8E71C", "#D0021B", "#8B572A", "#000000", "#9B9B9B", "#4A4A4A", "#7ED321", "#5C7C8A", "#E91E63"
    ];

    constructor(
        private readonly movieService: MovieService
    ) {}


    changeRankingData(): void {
        this.onRankingDataChange.emit(this.rankingData);
    }

    openTierSettings(index: number) {
        console.log("Open settings", index);
    }

    
    moveTierUp(index: number): void {
        const tierListData = this.rankingData?.tierListData;
        if (!tierListData || !tierListData.tiers || index <= 0) {
            return; 
        }

        const tiers = tierListData.tiers;
        const tierMovies = tierListData.tierMovies;

        const currentTierName = tiers[index].name;
        const prevTierName = tiers[index - 1].name;

        // 1. Swap tier names in the 'tiers' array
        [tiers[index], tiers[index - 1]] = [tiers[index - 1], tiers[index]];

        // 2. Update 'tierMovies' by re-assigning values to new tier names
        const prevTierContent = tierMovies[prevTierName];
        tierMovies[prevTierName] = tierMovies[currentTierName];
        tierMovies[currentTierName] = prevTierContent;

        this.rankingData = { ...this.rankingData };
        this.changeRankingData();
    }

    moveTierDown(index: number): void {
        const tierListData = this.rankingData?.tierListData;
        if (!tierListData || !tierListData.tiers) {
            return;
        }

        const tiers = tierListData.tiers;
        const tierMovies = tierListData.tierMovies;

        if (index >= tiers.length - 1) {
            return;
        }

        const currentTierName = tiers[index].name;
        const nextTierName = tiers[index + 1].name;

        // 1. Swap tier names in the 'tiers' array
        [tiers[index], tiers[index + 1]] = [tiers[index + 1], tiers[index]];

        // 2. Update 'tierMovies' by re-assigning values to new tier names
        const nextTierContent = tierMovies[nextTierName];
        tierMovies[nextTierName] = tierMovies[currentTierName];
        tierMovies[currentTierName] = nextTierContent;

        this.rankingData = { ...this.rankingData };
        this.changeRankingData();
    }

    faGear = faGear;
    faCaretUp = faCaretUp;
    faCaretDown = faCaretDown;
}
