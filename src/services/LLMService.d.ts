/**
 * LLM 响应接口
 */
interface LLMResponse {
    success: boolean;
    content?: string;
    error?: string;
}
/**
 * LLM 服务类
 */
export declare class LLMService {
    /**
     * 生成 Schema
     */
    generateSchema(prompt: string): Promise<LLMResponse>;
    /**
     * 优化 Schema
     */
    optimizeSchema(schema: string): Promise<LLMResponse>;
    /**
     * 调用 LLM API
     */
    private callLLM;
}
export {};
