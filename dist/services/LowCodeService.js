"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LowCodeService = void 0;
const lowcode_1 = require("../interfaces/lowcode");
const LLMService_1 = require("./LLMService");
const exampleSchema_1 = require("../examples/exampleSchema");
/**
 * 低代码服务类
 */
class LowCodeService {
    constructor() {
        this.deepseekModel = 'deepseek-chat';
        this.gpt4Model = 'gpt-4o-mini';
        this.llmService = new LLMService_1.LLMService();
    }
    /**
     * 生成页面 Schema
     */
    async generatePageSchema(request) {
        try {
            // 使用 DeepSeek 生成初始 Schema
            const schema = await this.generateSchemaWithDeepSeek(request);
            /* 暂时禁用 GPT-4 优化
            const optimizedSchema = await this.optimizeSchemaWithGPT4(schema);
            */
            return {
                success: true,
                data: schema
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : '生成页面 Schema 失败'
            };
        }
    }
    /**
     * 使用 DeepSeek 生成初始 Schema
     */
    async generateSchemaWithDeepSeek(request) {
        try {
            // 构建提示词
            const prompt = this.buildPrompt(request);
            // 调用 DeepSeek 模型
            const response = await this.llmService.callDeepSeek(prompt);
            // 解析响应
            const schema = this.parseResponse(response.text);
            return schema;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`DeepSeek 生成 Schema 失败: ${error.message}`);
            }
            throw new Error('DeepSeek 生成 Schema 失败');
        }
    }
    /**
     * 使用 GPT-4o-mini 优化 Schema
     */
    async optimizeSchemaWithGPT4(schema) {
        try {
            const prompt = `请优化以下页面 Schema，确保其符合最佳实践和用户体验：
${JSON.stringify(schema, null, 2)}

请考虑以下方面：
1. 组件的布局和排列是否合理
2. 表单验证规则是否完整
3. 交互体验是否流畅
4. 数据结构是否规范
5. 是否需要添加辅助性组件（如提示、帮助文本等）

请返回优化后的完整 Schema。`;
            const response = await this.llmService.callGPT4(prompt);
            const optimizedSchema = this.parseResponse(response.text);
            return optimizedSchema;
        }
        catch (error) {
            console.warn('GPT-4o-mini 优化失败，使用原始 Schema:', error instanceof Error ? error.message : '未知错误');
            return schema;
        }
    }
    /**
     * 构建提示词
     */
    buildPrompt(request) {
        return `你是一个专业的低代码平台页面生成器。请根据以下需求和可用组件，生成一个页面 Schema。

需求描述：
${request.description}

可用组件列表：
${request.materials.materials.join('\n')}

参考 Schema 示例：
${JSON.stringify(exampleSchema_1.exampleSchema, null, 2)}

严格要求：
1. 必须仅返回一个有效的 JSON 对象，不要包含任何其他说明文字
2. JSON 必须符合以下结构：
   {
     "type": "Page",
     "title": "页面标题",
     "components": [
       {
         "type": "组件类型",
         "props": {
           // 组件属性
         },
         "children": [] // 可选
       }
     ]
   }
3. 只能使用可用组件列表中列出的组件
4. 组件属性必须符合组件要求
5. 必须添加适当的验证规则
6. 必须提供合理的示例数据

请直接返回 JSON 格式的页面 Schema，不要添加任何额外的解释或说明。`;
    }
    /**
     * 解析响应
     */
    parseResponse(response) {
        try {
            // 首先尝试直接解析为 JSON
            try {
                const directJson = JSON.parse(response);
                if (this.validateSchema(directJson)) {
                    return directJson;
                }
            }
            catch (e) {
                // 直接解析失败，继续尝试其他方式
            }
            // 尝试从文本中提取 JSON
            const jsonRegexPatterns = [
                /```json\n([\s\S]*?)\n```/,
                /```typescript\n([\s\S]*?)\n```/,
                /```\n([\s\S]*?)\n```/,
                /{[\s\S]*}/ // 匹配最外层的大括号及其内容
            ];
            let jsonStr = '';
            for (const pattern of jsonRegexPatterns) {
                const match = response.match(pattern);
                if (match) {
                    jsonStr = match[1] || match[0];
                    try {
                        const schema = JSON.parse(jsonStr);
                        if (this.validateSchema(schema)) {
                            return schema;
                        }
                    }
                    catch (e) {
                        continue;
                    }
                }
            }
            // 如果所有尝试都失败，抛出错误
            throw new Error('无法从响应中提取有效的 JSON Schema');
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`解析响应失败: ${error.message}\n原始响应: ${response.substring(0, 200)}...`);
            }
            throw new Error('解析响应失败');
        }
    }
    /**
     * 验证 Schema 结构
     */
    validateSchema(schema) {
        return (typeof schema === 'object' &&
            schema !== null &&
            typeof schema.type === 'string' &&
            typeof schema.title === 'string' &&
            Array.isArray(schema.components));
    }
    /**
     * 错误处理
     */
    handleError(error) {
        console.error('LowCode Service Error:', error);
        return {
            code: lowcode_1.ErrorCode.GENERATION_FAILED,
            message: error.message || '生成失败',
            details: error,
            suggestions: [
                '检查物料列表是否正确',
                '确认需求描述是否清晰',
                '验证参考 Schema 格式'
            ]
        };
    }
}
exports.LowCodeService = LowCodeService;
