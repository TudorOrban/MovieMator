
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