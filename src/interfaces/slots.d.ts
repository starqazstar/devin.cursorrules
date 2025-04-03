export interface SlotDefinition {
    name: string;
    type: string;
    description?: string;
    required?: boolean;
    defaultValue?: any;
    validation?: {
        type: string;
        rules: any[];
    };
}
export interface ComponentSlots {
    [key: string]: SlotDefinition;
}
export interface SlotsRegistry {
    [componentName: string]: ComponentSlots;
}
export interface SlotValidationError {
    componentName: string;
    slotName: string;
    message: string;
    path?: string[];
}
export declare class SlotValidator {
    private registry;
    constructor(registry: SlotsRegistry);
    validateComponentSlots(componentName: string, slots: Record<string, any>, path?: string[]): SlotValidationError[];
    private validateSlotValue;
    private checkType;
    private applyValidationRule;
}
export default SlotValidator;
export interface ComponentSchema {
    type: string;
    props?: Record<string, any>;
    children?: ComponentSchema[];
    id?: string;
}
export interface JSSlot extends ComponentSchema {
    type: 'JSSlot';
    name: string;
    children: ComponentSchema[];
}
