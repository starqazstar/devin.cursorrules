export declare const ERROR_MESSAGES: {
    zh_CN: {
        invalidSlotName: {
            title: string;
            description: string;
            causes: string[];
            solutions: string[];
        };
        emptySlot: {
            title: string;
            description: string;
            causes: string[];
            solutions: string[];
        };
        invalidChildType: {
            title: string;
            description: string;
            causes: string[];
            solutions: string[];
        };
    };
    en_US: {
        invalidSlotName: {
            title: string;
            description: string;
            causes: string[];
            solutions: string[];
        };
        emptySlot: {
            title: string;
            description: string;
            causes: string[];
            solutions: string[];
        };
        invalidChildType: {
            title: string;
            description: string;
            causes: string[];
            solutions: string[];
        };
    };
};
export declare function getErrorMessage(locale: 'zh_CN' | 'en_US', errorType: keyof typeof ERROR_MESSAGES.zh_CN, params?: Record<string, string>): typeof ERROR_MESSAGES.zh_CN[keyof typeof ERROR_MESSAGES.zh_CN];
