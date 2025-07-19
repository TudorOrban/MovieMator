import { MovieSearchDto } from "../../movies/models/Movie";

export interface RankingSearchDto {
    id: number;
    userId: number;
    title: string;
    description?: string;
    tags?: string[];
    lastViewedAt?: Date;
    rankingType: RankingType;
    createdAt: Date;
    updatedAt: Date;
}

export interface RankingDataDto {
    id: number;
    userId: number;
    title: string;
    description?: string;
    tags?: string[];
    lastViewedAt?: Date;
    rankingType: RankingType;
    rankingData: RankingData;
    createdAt: Date;
    updatedAt: Date;
}

export interface RankingData {
    listData?: ListData;
    tierListData?: TierListData;
}

export interface ListData {}

export interface TierListData {
    tiers: TierData[];
    tierMovies: Record<string, MovieSearchDto[]>;
    availableMovies: MovieSearchDto[];
}

export interface MovieSmallData {
    id: number;
    title: string;
    posterUrl: string;
}

export interface TierData {
    name: string;
    color: string;
}

export const defaultRankingData: RankingData = {
    listData: {},
    tierListData: {
        tiers: [
            { name: "S", color: "#4A90E2"}, 
            { name: "A", color: "#50E3C2" }, 
            { name: "B", color: "#F5A623"},
            { name: "C", color: "#BD10E0"},
            { name: "D", color: "#9013FE"},
            { name: "E", color: "#417505"},
        ],
        tierMovies: { "S": [], "B": [], "C": [], "D": [], "E": [] },
        availableMovies: []
    }
}

export enum RankingType {
    LIST = "LIST",
    TIER_LIST = "TIER_LIST"
}

export interface CreateRankingDto {
    userId: number;
    title: string;
    description?: string;
    tags?: string[];
    rankingType: RankingType;
    rankingData: RankingData;
}

export interface UpdateRankingDto {
    id: number;
    userId: number;
    title: string;
    description?: string;
    tags?: string[];
    rankingType: RankingType;
    rankingData: RankingData;
}