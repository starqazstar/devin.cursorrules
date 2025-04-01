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
    materials: MaterialList;
    description: string;
}
/**
 * 错误码枚举
 */
export declare enum ErrorCode {
    INVALID_SCHEMA = "INVALID_SCHEMA",// Schema 格式错误
    UNKNOWN_COMPONENT = "UNKNOWN_COMPONENT",// 未知组件
    INVALID_PROPS = "INVALID_PROPS",// 属性错误
    GENERATION_FAILED = "GENERATION_FAILED"
}
/**
 * 错误响应接口
 */
export interface ErrorResponse {
    code: ErrorCode;
    message: string;
    details?: Record<string, any>;
    suggestions?: string[];
}
/**
 * 页面生成响应接口
 */
export interface PageGenerationResponse {
    success: boolean;
    data?: PageSchema;
    error?: string;
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
    components: Component[];
    dataSource?: DataSource;
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
