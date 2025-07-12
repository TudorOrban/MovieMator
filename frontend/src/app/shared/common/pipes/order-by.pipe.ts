import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'orderBy',
    standalone: true 
})
export class OrderByPipe implements PipeTransform {
    transform(value: any[] | null, propertyName?: string, order: "asc" | "desc" = "asc"): any[] | null {
        if (!value || !Array.isArray(value) || value.length === 0) {
            return value;
        }

        const sorted = [...value].sort((a, b) => {
            let aValue = propertyName ? a[propertyName] : a;
            let bValue = propertyName ? b[propertyName] : b;

            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return order === "asc" ? 1 : -1;
            if (bValue == null) return order === "asc" ? -1 : 1;

            if (typeof aValue === "string" && typeof bValue === "string") {
                return order === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            } else {
                return order === "asc" ? aValue - bValue : bValue - aValue;
            }
        });

        return sorted;
    }
}