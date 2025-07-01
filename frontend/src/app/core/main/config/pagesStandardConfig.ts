import { PagesSearchConfiguration } from "../../../shared/models/Search";
import { UIItem } from "../../../shared/models/UI";


export const standardSortOptions: UIItem[] = [
    { label: "Created At", value: "createdAt" },
    { label: "Last Modified", value: "updatedAt" },
    { label: "Title", value: "title" },
];

export const pagesSearchConfiguration: PagesSearchConfiguration = {
    pagesConfig: {
        "/movies": {
            sortOptions: standardSortOptions,
        },
    },
};
