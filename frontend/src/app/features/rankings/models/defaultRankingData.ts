import { RankingData } from "./Ranking";

export const defaultRankingData: RankingData = {
    listData: {},
    tierListData: {
        tiers: [
            { name: "S", color: "#C62828" },
            { name: "A", color: "#FF8A65" },
            { name: "B", color: "#FDD835" },
            { name: "C", color: "#81C784" },
            { name: "D", color: "#64B5F6" },
            { name: "E", color: "#8E24AA" },
        ],
        tierMovies: { "S": [], "A": [], "B": [], "C": [], "D": [], "E": [] },
        availableMovies: []
    }
};
