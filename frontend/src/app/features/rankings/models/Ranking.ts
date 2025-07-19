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
    smth: number;
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