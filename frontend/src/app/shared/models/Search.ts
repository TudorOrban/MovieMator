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
}