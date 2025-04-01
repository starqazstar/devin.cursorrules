"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const node_fetch_1 = __importDefault(require("node-fetch"));
// 加载环境变量
dotenv_1.default.config();
/**
 * LLM 服务类
 */
class LLMService {
    constructor() {
        // DeepSeek 配置
        this.deepseekConfig = {
            apiKey: process.env.DEEPSEEK_API_KEY || '',
            baseUrl: 'https://api.deepseek.com/v1',
            model: 'deepseek-chat',
            temperature: 0.7,
            maxTokens: 2000
        };
        // GPT-4o-mini 配置
        this.gpt4Config = {
            apiKey: process.env.OPENAI_API_KEY || '',
            baseUrl: 'https://api.openai.com/v1',
            model: 'GPT-4o-minio-mini-minio',
            temperature: 0.7,
            maxTokens: 2000
        };
    }
    /**
     * 调用 DeepSeek 模型
     */
    async callDeepSeek(prompt, config) {
        const finalConfig = { ...this.deepseekConfig, ...config };
        return this.callModel(finalConfig, prompt);
    }
    /**
     * 调用 GPT-4o-mini 模型
     */
    async callGPT4(prompt, config) {
        const finalConfig = { ...this.gpt4Config, ...config };
        return this.callModel(finalConfig, prompt);
    }
    /**
     * 调用 LLM 模型
     */
    async callModel(config, prompt) {
        try {
            const endpoint = config.model.startsWith('gpt-') ? 'completions' : 'chat/completions';
            const response = await (0, node_fetch_1.default)(`${config.baseUrl}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                body: JSON.stringify(config.model.startsWith('gpt-') ? {
                    model: config.model,
                    prompt: prompt,
                    temperature: config.temperature,
                    max_tokens: config.maxTokens
                } : {
                    model: config.model,
                    messages: [{ role: 'user', content: prompt }],
                    temperature: config.temperature,
                    max_tokens: config.maxTokens
                })
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API 请求失败: ${response.statusText}\n${errorText}`);
            }
            const data = await response.json();
            return {
                text: data.choices[0]?.message?.content || data.choices[0]?.text || '',
                usage: data.usage ? {
                    totalTokens: data.usage.total_tokens,
                    promptTokens: data.usage.prompt_tokens,
                    completionTokens: data.usage.completion_tokens
                } : undefined
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`调用模型失败: ${error.message}`);
            }
            throw new Error('调用模型失败');
        }
    }
}
exports.LLMService = LLMService;
