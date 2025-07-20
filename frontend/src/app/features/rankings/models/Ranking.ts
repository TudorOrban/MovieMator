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
            { name: "S", color: "#C62828"}, 
            { name: "A", color: "#FF8A65" }, 
            { name: "B", color: "#FDD835"},
            { name: "C", color: "#81C784"},
            { name: "D", color: "#64B5F6"},
            { name: "E", color: "#8E24AA"},
        ],
        tierMovies: { "S": [], "A": [], "B": [], "C": [], "D": [], "E": [] },
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