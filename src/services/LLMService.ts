// LLM API 配置
const API_CONFIG = {
  GENERATE_API_URL: 'http://localhost:3002/api/llm/generate',
  OPTIMIZE_API_URL: 'http://localhost:3002/api/llm/optimize'
};

/**
 * API 响应接口
 */
interface APIResponse {
  choices: Array<{
    text?: string;
    message?: {
      content: string;
    };
  }>;
  usage?: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
}

/**
 * LLM 服务配置接口
 */
interface LLMConfig {
  apiUrl: string;
  model?: string;
}

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
export class LLMService {
  /**
   * 生成 Schema
   */
  public async generateSchema(prompt: string): Promise<LLMResponse> {
    console.log('Generating schema with prompt:', prompt);
    return this.callLLM(prompt, API_CONFIG.GENERATE_API_URL);
  }

  /**
   * 优化 Schema
   */
  public async optimizeSchema(schema: string): Promise<LLMResponse> {
    const optimizePrompt = `请优化以下页面 Schema，确保：
1. 布局合理，符合用户习惯
2. 组件属性配置完整
3. 表单验证规则合适
4. 数据结构清晰
5. 必要时添加辅助组件（如提示、帮助文本等）

Schema:
${schema}`;

    console.log('Optimizing schema with prompt:', optimizePrompt);
    return this.callLLM(optimizePrompt, API_CONFIG.OPTIMIZE_API_URL);
  }

  /**
   * 调用 LLM API
   */
  private async callLLM(prompt: string, apiUrl: string): Promise<LLMResponse> {
    try {
      console.log(`Making request to ${apiUrl}`);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('LLM response:', data);
      return data;
    } catch (error) {
      console.error('LLM API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }
} 