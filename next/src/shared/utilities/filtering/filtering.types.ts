import { Locale } from "../indexing/indexing.types";

export interface FilterParams {
    indexedMap: Record<string, number[]>;
    searchValue: string;
}

export type TranslationsMap = {
    [key in Locale]: {
        [key: string]: string;
    };
};

export const translationsMap: TranslationsMap  = {
    et: {
        "esitatud": "SUBMITTED",
        "töötlemisel": "IN_PROCESS",
        "täiendav läbivaatus": "ADDITIONAL_REVIEW",
        "läbivaatus lõpetatud": "REVIEW_COMPLETED",
        "kehtetu": "INVALID",

    },
    en: {
        "submitted": "SUBMITTED",
        "in process": "IN_PROCESS",
        "additional review": "ADDITIONAL_REVIEW",
        "review completed": "REVIEW_COMPLETED",
        "invalid": "INVALID",
    },
    ru: {
        "отправлено": "SUBMITTED",
        "в процессе": "IN_PROCESS",
        "доп. проверка": "ADDITIONAL_REVIEW",
        "проверка завершена": "REVIEW_COMPLETED",
        "недействительно": "INVALID"
    }
}


export interface FilterStateParams {
    indexedMap: Record<string, number[]>;
    searchStatesArray: string[] | null;
}

