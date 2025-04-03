export declare const ERROR_EXAMPLES: {
    invalidSlotName: {
        error: {
            type: string;
            name: string;
            children: never[];
        };
        message: string;
        solution: string;
    };
    emptySlot: {
        error: {
            type: string;
            name: string;
            children: never[];
        };
        message: string;
        solution: string;
    };
    invalidChildType: {
        error: {
            type: string;
            name: string;
            children: {
                type: string;
                props: {};
            }[];
        };
        message: string;
        solution: string;
    };
};
export declare const ERROR_SOLUTIONS: {
    slotName: (name: string) => string;
    emptyChildren: string;
    invalidType: (type: string) => string;
};
