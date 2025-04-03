/**
 * 低代码平台协议接口定义
 */
/**
 * 组件属性定义
 */
export interface ComponentPropDefinition {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function';
    title: string;
    description?: string;
    default?: any;
    required?: boolean;
    validator?: string;
    format?: string;
    items?: ComponentPropDefinition;
    properties?: Record<string, ComponentPropDefinition>;
    enum?: any[];
    enumNames?: string[];
    minimum?: number;
    maximum?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
}
/**
 * 组件定义
 */
export interface ComponentDefinition {
    name: string;
    title: string;
    description?: string;
    icon?: string;
    category?: string;
    props: Record<string, ComponentPropDefinition>;
    events?: Record<string, {
        description: string;
        parameters?: Record<string, ComponentPropDefinition>;
    }>;
    slots?: Record<string, {
        description: string;
        scope?: Record<string, ComponentPropDefinition>;
    }>;
    methods?: Record<string, {
        description: string;
        parameters?: Record<string, ComponentPropDefinition>;
        returns?: ComponentPropDefinition;
    }>;
}
/**
 * 物料协议
 */
export interface MaterialProtocol {
    version: string;
    components: ComponentDefinition[];
    categories: Array<{
        name: string;
        title: string;
        components: string[];
    }>;
}
/**
 * 页面协议
 */
export interface PageProtocol {
    version: string;
    title: string;
    description?: string;
    components: Array<{
        id: string;
        type: string;
        props: Record<string, any>;
        style?: Record<string, any>;
        events?: Record<string, string | Function>;
        children?: PageProtocol['components'];
    }>;
    dataSource?: {
        list: Array<{
            id: string;
            type: 'api' | 'static';
            options: {
                url?: string;
                method?: string;
                data?: Record<string, any>;
                headers?: Record<string, string>;
                params?: Record<string, any>;
            };
        }>;
        relations: Array<{
            from: string;
            to: string;
            mapping: Record<string, string>;
        }>;
    };
    state?: {
        initial: Record<string, any>;
        computed: Record<string, string>;
    };
    methods?: Record<string, string | Function>;
    lifeCycles?: {
        created?: string | Function;
        mounted?: string | Function;
        updated?: string | Function;
        destroyed?: string | Function;
    };
}
/**
 * 低代码平台 Function Call 定义
 */
export declare const lowcodeFunctions: {
    /**
     * 生成页面
     */
    generatePage: {
        name: string;
        description: string;
        parameters: {
            type: string;
            properties: {
                description: {
                    type: string;
                    description: string;
                };
                components: {
                    type: string;
                    description: string;
                    items: {
                        type: string;
                        properties: {
                            name: {
                                type: string;
                            };
                            props: {
                                type: string;
                            };
                        };
                    };
                };
                template: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    /**
     * 更新组件属性
     */
    updateProps: {
        name: string;
        description: string;
        parameters: {
            type: string;
            properties: {
                componentId: {
                    type: string;
                    description: string;
                };
                props: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    /**
     * 添加数据源
     */
    addDataSource: {
        name: string;
        description: string;
        parameters: {
            type: string;
            properties: {
                type: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                options: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    /**
     * 添加事件处理
     */
    addEventHandler: {
        name: string;
        description: string;
        parameters: {
            type: string;
            properties: {
                componentId: {
                    type: string;
                    description: string;
                };
                event: {
                    type: string;
                    description: string;
                };
                handler: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
};
/**
 * 低代码平台响应格式
 */
export interface LowCodeResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
    meta?: {
        requestId: string;
        timestamp: number;
        duration: number;
    };
}
