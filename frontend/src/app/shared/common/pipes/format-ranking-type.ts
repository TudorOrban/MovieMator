import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: "formatRankingType",
  standalone: true
})
export class FormatRankingTypePipe implements PipeTransform {
    transform(value: string | null | undefined): string {
        if (value === null || value === undefined) {
            return "None";
        }

        const spacedValue = value.replace(/_/g, " ");

        const words = spacedValue.split(" ");
        const formattedWords = words.map((word, index) => {
            if (word.length === 0) {
                return "";
            }
            const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            
            if (capitalizedWord.toLowerCase() === "list" && index > 0 && words[index - 1].toLowerCase() === "tier") {
                return "List";
            }
            return capitalizedWord;
        });

        return formattedWords.join(" ");
    }
}