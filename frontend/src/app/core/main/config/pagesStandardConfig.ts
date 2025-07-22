import { FilterOption, FilterType, PagesSearchConfiguration } from "../../../shared/models/Search";
import { UIItem } from "../../../shared/models/UI";


export const userSortOptions: UIItem[] = [
    { label: "Created At", value: "createdAt" },
    { label: "Last Modified", value: "updatedAt" },
    { label: "Display Name", value: "displayName" },
];

export const movieSortOptions: UIItem[] = [
    { label: "Created At", value: "createdAt" },
    { label: "Last Modified", value: "updatedAt" },
    { label: "Title", value: "title" },
    { label: "Director", value: "director" },
    { label: "Runtime", value: "runtimeMinutes" },
    { label: "Watched Date", value: "watchedDates" },
    { label: "Rating", value: "userRating" },
    { label: "Release Year", value: "releaseYear" },
];

export const rankingSortOptions: UIItem[] = [
    { label: "Created At", value: "createdAt" },
    { label: "Last Modified", value: "updatedAt" },
    { label: "Title", value: "title" },
];

export const standardFilterOptions: FilterOption[] = [
    {
        key: { label: "Release Year", value: "releaseYear" },
        filterType: FilterType.NUMBER,
    },
    {
        key: { label: "Director", value: "director" },
        filterType: FilterType.TEXT, 
    },
    {
        key: { label: "User Rating", value: "userRating" },
        filterType: FilterType.NUMBER,
    },
    {
        key: { label: "Watched Date", value: "watchedDate" },
        filterType: FilterType.DATE,
    },
    { 
        key: { label: "Status", value: "status" }, 
        filterType: FilterType.ENUM 
    },
    { 
        key: { label: "Runtime", value: "runtimeMinutes" }, 
        filterType: FilterType.NUMBER 
    },
    { 
        key: { label: "Genres", value: "genresIncluding" }, 
        filterType: FilterType.MULTI_TEXT 
    },
    { 
        key: { label: "Actors", value: "actorsIncluding" }, 
        filterType: FilterType.MULTI_TEXT 
    }, 
];

export const pagesSearchConfiguration: PagesSearchConfiguration = {
    pagesConfig: {
        "/users": {
            sortOptions: userSortOptions,
            filterOptions: standardFilterOptions
        },
        "/movies": {
            sortOptions: movieSortOptions,
            filterOptions: standardFilterOptions
        },
        "/rankings": {
            sortOptions: movieSortOptions,
            filterOptions: standardFilterOptions
        },
    },
};
