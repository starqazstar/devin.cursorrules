/**
 * 低代码平台物料数据接口
 */
export interface MaterialData {
    componentName: string;
    id: string;
    props: Record<string, any>;
    hidden?: boolean;
    title?: string;
    isLocked?: boolean;
    condition?: boolean;
    conditionGroup?: string;
    children?: MaterialData[];
    i18n?: Record<string, Record<string, string>>;
    style?: Record<string, any>;
    events?: Record<string, string>;
    validators?: Array<{
        type: string;
        message: string;
        params?: any;
    }>;
}
/**
 * 物料列表接口
 */
export interface MaterialList {
    materials: string[];
}
/**
 * 页面生成请求接口
 */
export interface PageGenerationRequest {
    description: string;
    components: string[];
    options?: {
        template?: string;
        theme?: string;
        i18n?: boolean;
    };
}
/**
 * 错误码枚举
 */
export declare enum ErrorCode {
    INVALID_SCHEMA = "INVALID_SCHEMA",// Schema 格式错误
    UNKNOWN_COMPONENT = "UNKNOWN_COMPONENT",// 未知组件
    INVALID_PROPS = "INVALID_PROPS",// 属性错误
    GENERATION_FAILED = "GENERATION_FAILED",// 生成失败
    INVALID_REQUEST = "INVALID_REQUEST",// 请求参数错误
    UNAUTHORIZED = "UNAUTHORIZED",// 未授权
    NOT_FOUND = "NOT_FOUND",// 资源未找到
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",// 超出请求限制
    INTERNAL_ERROR = "INTERNAL_ERROR",// 内部错误
    VALIDATION_ERROR = "VALIDATION_ERROR"
}
/**
 * 错误响应接口
 */
export interface ErrorResponse {
    code: ErrorCode;
    message: string;
    details?: any;
    suggestions?: string[];
    timestamp?: number;
    requestId?: string;
}
/**
 * 页面生成响应接口
 */
export interface PageGenerationResponse {
    success: boolean;
    data?: MaterialData;
    error?: ErrorResponse;
    meta?: {
        generationTime: number;
        modelUsed: string;
        promptTokens: number;
        totalTokens: number;
    };
}
/**
 * Function Call 接口定义
 */
export interface FunctionCall {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: Record<string, {
            type: string;
            description: string;
            required?: boolean;
        }>;
        required: string[];
    };
}
/**
 * 组件生成函数定义
 */
export declare const generatePageSchema: FunctionCall;
/**
 * Schema 验证函数定义
 */
export declare const validateSchema: FunctionCall;
/**
 * 组件属性优化函数定义
 */
export declare const optimizeProps: FunctionCall;
/**
 * 页面 Schema 接口
 */
export interface PageSchema {
    type: string;
    title: string;
    components: Array<{
        type: string;
        props: Record<string, any>;
        children?: any[];
    }>;
    dataSource?: {
        data: Record<string, any>;
    };
    layout?: {
        type: string;
        props: any;
    };
    theme?: {
        primary: string;
        layout: string;
    };
    i18n?: {
        defaultLocale: string;
        locales: string[];
        messages: Record<string, Record<string, string>>;
    };
}
/**
 * 组件接口
 */
export interface Component {
    type: string;
    props: Record<string, any>;
    children?: Component[];
}
/**
 * 数据源接口
 */
export interface DataSource {
    type: string;
    data: Record<string, any>;
}
/**
 * 性能监控数据接口
 */
export interface PerformanceData {
    requestCount: number;
    averageResponseTime: number;
    errorCount: number;
    slowRequestCount: number;
}
/**
 * 缓存配置接口
 */
export interface CacheConfig {
    enabled: boolean;
    ttl: number;
    maxSize: number;
}
/**
 * 监控配置接口
 */
export interface MonitoringConfig {
    enabled: boolean;
    logLevel: string;
    slowThreshold: number;
}
