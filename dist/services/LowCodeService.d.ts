import { PageGenerationRequest, PageGenerationResponse } from '../interfaces/lowcode';
/**
 * 低代码服务类
 */
export declare class LowCodeService {
    private llmService;
    private deepseekModel;
    private gpt4Model;
    constructor();
    /**
     * 生成页面 Schema
     */
    generatePageSchema(request: PageGenerationRequest): Promise<PageGenerationResponse>;
    /**
     * 使用 DeepSeek 生成初始 Schema
     */
    private generateSchemaWithDeepSeek;
    /**
     * 使用 GPT-4o-mini 优化 Schema
     */
    private optimizeSchemaWithGPT4;
    /**
     * 构建提示词
     */
    private buildPrompt;
    /**
     * 解析响应
     */
    private parseResponse;
    /**
     * 验证 Schema 结构
     */
    private validateSchema;
    /**
     * 错误处理
     */
    private handleError;
}
