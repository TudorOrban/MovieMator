import { MovieFilters, SearchParams } from "../../../shared/models/Search";

export class SearchCacheKeyBuilder {

    static buildUserSearchKey(userId: number, searchParams: SearchParams): string {
        const normalizedSearchObject = {
            userId: userId,
            searchText: searchParams.searchText || "",
            sortBy: searchParams.sortBy || "createdAt",
            isAscending: searchParams.isAscending ?? true,
            page: searchParams.page ?? 1,
            itemsPerPage: searchParams.itemsPerPage ?? 20,
        };

        return JSON.stringify(normalizedSearchObject);
    }

    static buildMovieSearchKey(userId: number, searchParams: SearchParams, movieFilters: MovieFilters): string {
        const normalizedSearchObject = {
            userId: userId,
            searchText: searchParams.searchText || "",
            sortBy: searchParams.sortBy || "createdAt",
            isAscending: searchParams.isAscending ?? true,
            page: searchParams.page ?? 1,
            itemsPerPage: searchParams.itemsPerPage ?? 20,
            filters: {
                ...(movieFilters.releaseYearFrom != null && { releaseYearFrom: movieFilters.releaseYearFrom }),
                ...(movieFilters.releaseYearTo != null && { releaseYearTo: movieFilters.releaseYearTo }),
                ...(movieFilters.director != null && { director: movieFilters.director }),
                ...(movieFilters.userRatingFrom != null && { userRatingFrom: movieFilters.userRatingFrom }),
                ...(movieFilters.userRatingTo != null && { userRatingTo: movieFilters.userRatingTo }),
                ...(movieFilters.watchedDateFrom != null && { watchedDateFrom: movieFilters.watchedDateFrom }),
                ...(movieFilters.watchedDateTo != null && { watchedDateTo: movieFilters.watchedDateTo }),
                ...(movieFilters.status != null && { status: movieFilters.status }),
                ...(movieFilters.runtimeMinutesLessThan != null && { runtimeMinutesLessThan: movieFilters.runtimeMinutesLessThan }),
                ...(movieFilters.runtimeMinutesMoreThan != null && { runtimeMinutesMoreThan: movieFilters.runtimeMinutesMoreThan }),
                ...(movieFilters.genresIncluding?.length ? { genresIncluding: [...movieFilters.genresIncluding].sort() } : {}),
                ...(movieFilters.actorsIncluding?.length ? { actorsIncluding: [...movieFilters.actorsIncluding].sort() } : {}),
            }
        };

        return JSON.stringify(normalizedSearchObject);
    }
}