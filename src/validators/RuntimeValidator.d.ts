import { ComponentSchema } from '../interfaces/slots';
interface ValidationError {
    path: string[];
    message: string;
    component: string;
    suggestions?: string[];
}
interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    performance: {
        duration: number;
        componentsChecked: number;
    };
    debug?: {
        validationTrace: ValidationTrace[];
        cacheStats: {
            hits: number;
            misses: number;
            size: number;
        };
    };
}
interface ValidationTrace {
    component: string;
    path: string[];
    duration: number;
    childrenCount: number;
    errors: ValidationError[];
}
export declare class RuntimeValidator {
    private static instance;
    private cache;
    private constructor();
    static getInstance(): RuntimeValidator;
    /**
     * 验证组件树
     * @param schema 组件 Schema
     * @param enableDebug 是否启用调试
     * @returns 验证结果
     */
    validate(schema: ComponentSchema, enableDebug?: boolean): ValidationResult;
    /**
     * 生成缓存键
     * @param schema 组件 Schema
     * @returns 缓存键
     */
    private generateCacheKey;
    /**
     * 获取验证器性能统计
     * @returns 性能统计信息
     */
    getPerformanceStats(): {
        cacheSize: number;
        cacheHits: number;
        cacheMisses: number;
        averageValidationTime: number;
    };
    private _cacheHits;
    private _cacheMisses;
    private _totalValidationTime;
    /**
     * 重置性能统计
     */
    resetPerformanceStats(): void;
    /**
     * 验证单个组件
     * @param component 组件
     * @param context 验证上下文
     * @returns 验证错误列表
     */
    private validateComponent;
    /**
     * 验证插槽
     * @param slot 插槽组件
     * @param context 验证上下文
     * @returns 验证错误列表
     */
    private validateSlot;
    /**
     * 验证组件属性
     * @param component 组件
     * @param context 验证上下文
     * @returns 验证错误列表
     */
    private validateProps;
    /**
     * 验证属性类型
     * @param value 属性值
     * @param type 期望类型
     * @returns 是否类型匹配
     */
    private validatePropType;
    /**
     * 获取相似组件建议
     * @param type 未知的组件类型
     * @returns 建议列表
     */
    private getSuggestions;
    /**
     * 获取相似属性建议
     * @param prop 未知的属性名
     * @param props 已知的属性集合
     * @returns 建议列表
     */
    private getSimilarProps;
    /**
     * 计算字符串相似度（Levenshtein 距离）
     * @param str1 字符串1
     * @param str2 字符串2
     * @returns 相似度（0-1）
     */
    private calculateSimilarity;
    /**
     * 清除缓存
     */
    clearCache(): void;
}
export {};
