import { MovieStatus } from "../../features/movies/models/Movie";
import { UIItem } from "./UI";

export interface PaginatedResults<T> {
    results: T[];
    totalCount: number;
}

export interface SearchParams {
    searchText: string;
    sortBy: string;
    isAscending: boolean;
    page: number;
    itemsPerPage: number;
}

export interface PagesSearchConfiguration {
    pagesConfig: Record<string, PageSearchConfiguration>; // Key: page link
}

export interface PageSearchConfiguration {
    sortOptions: UIItem[];
    filterOptions: FilterOption[];
}

export interface MovieFilters {
    releaseYearFrom?: number;
    releaseYearTo?: number;
    director?: string;
    userRatingFrom?: number;
    userRatingTo?: number;
    watchedDateFrom?: string;
    watchedDateTo?: string;
    // New
    status?: MovieStatus;
    runtimeMinutesLessThan?: number;
    runtimeMinutesMoreThan?: number;
    genresIncluding?: string[];
    actorsIncluding?: string[];
}

export interface FilterOption {
    key: UIItem;
    valueOptions?: UIItem[];
    filterType: FilterType;
}

export enum FilterType {
    NUMBER = "NUMBER",
    ENUM = "ENUM",
    DATE = "DATE",
    TEXT = "TEXT",
    MULTI_TEXT = "MULTI_TEXT"
}
