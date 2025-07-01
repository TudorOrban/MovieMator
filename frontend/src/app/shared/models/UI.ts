import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface UIItem {
    label: string;
    value: string;
    link?: string;
    icon?: IconDefinition;
}

export interface ToastItem {
    id?: number;
    title: string;
    details?: string;
    type: ToastType;
}

export enum ToastType {
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    WARNING = "WARNING",
    INFO = "INFO"
}