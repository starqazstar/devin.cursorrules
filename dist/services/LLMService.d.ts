/**
 * LLM 服务配置接口
 */
interface LLMConfig {
    apiKey: string;
    baseUrl: string;
    model: string;
    temperature: number;
    maxTokens: number;
}
/**
 * LLM 响应接口
 */
interface LLMResponse {
    text: string;
    usage?: {
        totalTokens: number;
        promptTokens: number;
        completionTokens: number;
    };
}
/**
 * LLM 服务类
 */
export declare class LLMService {
    private deepseekConfig;
    private gpt4Config;
    constructor();
    /**
     * 调用 DeepSeek 模型
     */
    callDeepSeek(prompt: string, config?: Partial<LLMConfig>): Promise<LLMResponse>;
    /**
     * 调用 GPT-4o-mini 模型
     */
    callGPT4(prompt: string, config?: Partial<LLMConfig>): Promise<LLMResponse>;
    /**
     * 调用 LLM 模型
     */
    private callModel;
}
export {};
