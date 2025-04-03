import { SlotsRegistry } from '../interfaces/slots';
interface ComponentPropDefinition {
    type: string;
    required?: boolean;
    description?: string;
}
interface ComponentDefinition {
    props?: Record<string, ComponentPropDefinition>;
    requiredProps?: string[];
    description?: string;
}
export declare const ComponentRegistry: Record<string, ComponentDefinition>;
export declare const COMPONENT_SLOTS_REGISTRY: SlotsRegistry;
export {};
