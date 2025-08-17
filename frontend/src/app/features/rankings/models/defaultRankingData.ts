import { RankingData } from "./Ranking";
import { v4 as uuidv4 } from 'uuid';

export const defaultRankingData: RankingData = {
    listData: {},
    tierListData: {
        tiers: [
            { id: uuidv4(), name: "S", color: "#C62828" },
            { id: uuidv4(), name: "A", color: "#FF8A65" },
            { id: uuidv4(), name: "B", color: "#FDD835" },
            { id: uuidv4(), name: "C", color: "#81C784" },
            { id: uuidv4(), name: "D", color: "#64B5F6" },
            { id: uuidv4(), name: "E", color: "#8E24AA" },
            { id: uuidv4(), name: "F", color: "#D81B60" },
        ],

        tierMovies: { "S": [], "A": [], "B": [], "C": [], "D": [], "E": [], "F": [] },
        availableMovies: []
    }
};