import { PageGenerationRequest, PageGenerationResponse, PageSchema } from '../interfaces/lowcode';
import { MaterialProtocol } from '../interfaces/lowcode-protocol';
/**
 * 低代码服务类
 */
export declare class LowCodeService {
    private llmService;
    private deepseekModel;
    private gpt4Model;
    private materialProtocol;
    private readonly config;
    private requestCount;
    private totalResponseTime;
    constructor();
    /**
     * 初始化物料协议
     */
    initMaterialProtocol(protocol: MaterialProtocol): Promise<void>;
    /**
     * 获取平均响应时间
     */
    getAverageResponseTime(): number;
    /**
     * 获取请求统计信息
     */
    getRequestStats(): {
        totalRequests: number;
        averageResponseTime: number;
    };
    /**
     * 发送请求并重试
     */
    private fetchWithRetry;
    /**
     * 获取最终的 JSON 格式 Schema
     */
    getFinalSchema(request: PageGenerationRequest): Promise<PageGenerationResponse>;
    /**
     * 生成页面 Schema
     */
    generatePageSchema(request: PageGenerationRequest): Promise<PageSchema | null>;
    /**
     * 使用 DeepSeek 生成基础 Schema
     */
    private generateSchemaWithDeepSeek;
    /**
     * 优化 Schema
     */
    optimizeSchema(schema: any, componentName: string): Promise<any>;
    /**
     * 验证 Schema
     */
    validateSchema(schema: any, materials: string[]): Promise<any>;
    /**
     * 优化生成的 Schema
     */
    private optimizeGeneratedSchema;
    /**
     * 转换为页面协议格式
     */
    private convertToPageProtocol;
    /**
     * 转换组件列表
     */
    private convertComponents;
    /**
     * 构建提示词
     */
    private buildPrompt;
    /**
     * 解析响应
     */
    private parseResponse;
    /**
     * 验证基础 Schema 结构
     */
    private validateBasicSchema;
    /**
     * 错误处理
     */
    private handleError;
    /**
     * 使用 DeepSeek 优化 Schema
     */
    private optimizeSchemaWithDeepSeek;
    /**
     * 验证 Schema 结构和类型
     */
    private validateSchemaStructure;
    /**
     * 验证 Schema 与物料的兼容性
     */
    validateSchemaWithMaterials(schema: any, materials: string[]): Promise<any>;
    /**
     * 优化 Schema 的组件结构和属性
     */
    optimizeSchemaStructure(schema: any, componentName: string): Promise<any>;
}
