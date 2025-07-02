import { FilterOption, FilterType, PagesSearchConfiguration } from "../../../shared/models/Search";
import { UIItem } from "../../../shared/models/UI";


export const standardSortOptions: UIItem[] = [
    { label: "Created At", value: "createdAt" },
    { label: "Last Modified", value: "updatedAt" },
    { label: "Title", value: "title" },
];

export const standardFilterOptions: FilterOption[] = [
    {
        key: { label: "Release Year", value: "releaseYear" },
        valueOptions: [],
        filterType: FilterType.NUMBER,
    },
    {
        key: { label: "Director", value: "director" },
        valueOptions: [],
        filterType: FilterType.TEXT, 
    },
    {
        key: { label: "User Rating", value: "userRating" },
        valueOptions: [],
        filterType: FilterType.NUMBER,
    },
    {
        key: { label: "Watched Date", value: "watchedDate" },
        valueOptions: [],
        filterType: FilterType.DATE,
    },
];

export const pagesSearchConfiguration: PagesSearchConfiguration = {
    pagesConfig: {
        "/movies": {
            sortOptions: standardSortOptions,
            filterOptions: standardFilterOptions
        },
    },
};
