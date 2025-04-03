import { 
  MaterialData, 
  MaterialList, 
  PageGenerationRequest, 
  PageGenerationResponse,
  ErrorCode,
  ErrorResponse,
  PageSchema
} from '../interfaces/lowcode';
import {
  ComponentDefinition,
  MaterialProtocol,
  PageProtocol,
  LowCodeResponse,
  lowcodeFunctions
} from '../interfaces/lowcode-protocol';
import { LLMService } from './LLMService';
import { exampleSchema } from '../examples/exampleSchema';

/**
 * 低代码服务配置接口
 */
interface ServiceConfig {
  apiUrl: string;
  timeout: number;
  retryCount: number;
  retryDelay: number;
}

/**
 * 低代码服务类
 */
export class LowCodeService {
  private llmService: LLMService;
  private deepseekModel: string = 'deepseek-chat';
  private gpt4Model: string = 'gpt-4o-mini';
  private materialProtocol: MaterialProtocol;
  private readonly config: ServiceConfig;
  private requestCount: number = 0;
  private totalResponseTime: number = 0;

  constructor() {
    this.llmService = new LLMService();
    this.materialProtocol = {
      version: '1.0.0',
      components: [],
      categories: []
    };
    this.config = {
      apiUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002',
      timeout: parseInt(import.meta.env.VITE_REQUEST_TIMEOUT || '60000'), // 从环境变量读取超时时间，默认 60 秒
      retryCount: parseInt(import.meta.env.VITE_RETRY_COUNT || '3'),
      retryDelay: parseInt(import.meta.env.VITE_RETRY_DELAY || '1000')
    };
  }

  /**
   * 初始化物料协议
   */
  public async initMaterialProtocol(protocol: MaterialProtocol): Promise<void> {
    this.materialProtocol = protocol;
  }

  /**
   * 获取平均响应时间
   */
  public getAverageResponseTime(): number {
    return this.requestCount > 0 ? this.totalResponseTime / this.requestCount : 0;
  }

  /**
   * 获取请求统计信息
   */
  public getRequestStats() {
    return {
      totalRequests: this.requestCount,
      averageResponseTime: this.getAverageResponseTime()
    };
  }

  /**
   * 发送请求并重试
   */
  private async fetchWithRetry(url: string, options: RequestInit, retryCount = this.config.retryCount): Promise<Response> {
    let timeoutId: NodeJS.Timeout | null = null;
    try {
      const controller = new AbortController();
      timeoutId = setTimeout(() => {
        controller.abort();
        timeoutId = null;
      }, this.config.timeout);

      const startTime = Date.now();
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      const endTime = Date.now();

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      this.requestCount++;
      this.totalResponseTime += (endTime - startTime);

      if (!response.ok && retryCount > 0) {
        console.warn(`请求失败，将在 ${this.config.retryDelay}ms 后重试，剩余重试次数：${retryCount}`);
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        return this.fetchWithRetry(url, options, retryCount - 1);
      }

      return response;
    } catch (error) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        if (retryCount > 0) {
          console.warn(`请求超时，将在 ${this.config.retryDelay}ms 后重试，剩余重试次数：${retryCount}`);
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
          return this.fetchWithRetry(url, options, retryCount - 1);
        }
        throw new Error(`请求超时（${this.config.timeout}ms）`);
      }
      
      if (retryCount > 0) {
        console.warn(`请求出错，将在 ${this.config.retryDelay}ms 后重试，剩余重试次数：${retryCount}`);
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        return this.fetchWithRetry(url, options, retryCount - 1);
      }
      throw error;
    }
  }

  /**
   * 获取最终的 JSON 格式 Schema
   */
  public async getFinalSchema(request: PageGenerationRequest): Promise<PageGenerationResponse> {
    try {
      console.log('发送生成请求:', request);

      const response = await this.fetchWithRetry(
        `${this.config.apiUrl}/api/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(request)
        }
      );

      const data = await response.json();
      console.log('API 响应:', data);

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.error?.code || ErrorCode.GENERATION_FAILED,
            message: data.error?.message || '生成失败',
            details: data.error?.details
          }
        };
      }

      return {
        success: true,
        data: data.data
      };
    } catch (err) {
      console.error('请求错误:', err);
      return {
        success: false,
        error: {
          code: ErrorCode.GENERATION_FAILED,
          message: err instanceof Error ? err.message : '生成失败',
          details: err
        }
      };
    }
  }

  /**
   * 生成页面 Schema
   */
  public async generatePageSchema(request: PageGenerationRequest): Promise<PageSchema | null> {
    try {
      // 使用 DeepSeek 生成基础 Schema
      const baseSchema = await this.generateSchemaWithDeepSeek(request);
      if (!baseSchema) {
        throw new Error('Schema 生成失败');
      }

      // 使用 DeepSeek 优化 Schema
      return await this.optimizeGeneratedSchema(baseSchema);
    } catch (error) {
      console.error('生成页面 Schema 失败:', error);
      return null;
    }
  }

  /**
   * 使用 DeepSeek 生成基础 Schema
   */
  private async generateSchemaWithDeepSeek(request: PageGenerationRequest): Promise<PageSchema | null> {
    try {
      const prompt = this.buildPrompt(request);
      const response = await this.llmService.generateSchema(prompt);

      if (!response.success || !response.content) {
        throw new Error(response.error || 'Schema 生成失败');
      }

      return this.parseResponse(response.content);
    } catch (error) {
      console.error('DeepSeek 生成 Schema 失败:', error);
      return null;
    }
  }

  /**
   * 优化 Schema
   */
  public async optimizeSchema(schema: any, componentName: string): Promise<any> {
    return this.optimizeSchemaStructure(schema, componentName);
  }

  /**
   * 验证 Schema
   */
  public async validateSchema(schema: any, materials: string[]): Promise<any> {
    return this.validateSchemaWithMaterials(schema, materials);
  }

  /**
   * 优化生成的 Schema
   */
  private async optimizeGeneratedSchema(schema: PageSchema): Promise<PageSchema> {
    try {
      const response = await this.llmService.optimizeSchema(JSON.stringify(schema, null, 2));

      if (!response.success || !response.content) {
        console.warn('Schema 优化失败，使用原始 Schema');
        return schema;
      }

      const optimizedSchema = this.parseResponse(response.content);
      return optimizedSchema || schema;
    } catch (error) {
      console.warn('Schema 优化失败，使用原始 Schema:', error);
      return schema;
    }
  }

  /**
   * 转换为页面协议格式
   */
  private convertToPageProtocol(schema: PageSchema): PageProtocol {
    return {
      version: '1.0.0',
      title: schema.title,
      components: schema.components.map(comp => ({
        id: Math.random().toString(36).substr(2, 9),
        type: comp.type,
        props: comp.props,
        children: comp.children ? this.convertComponents(comp.children) : undefined
      })),
      dataSource: schema.dataSource ? {
        list: [{
          id: 'default',
          type: 'static',
          options: {
            data: schema.dataSource.data
          }
        }],
        relations: []
      } : undefined
    };
  }

  /**
   * 转换组件列表
   */
  private convertComponents(components: any[]): PageProtocol['components'] {
    return components.map(comp => ({
      id: Math.random().toString(36).substr(2, 9),
      type: comp.type,
      props: comp.props,
      children: comp.children ? this.convertComponents(comp.children) : undefined
    }));
  }

  /**
   * 构建提示词
   */
  private buildPrompt(request: PageGenerationRequest): string {
    return `请根据以下需求生成页面 Schema。

可用组件列表：
${JSON.stringify(request.components, null, 2)}

示例 1 - 用户登录页面：
思考步骤：
1. 分析页面结构：
   - 需要一个居中的登录表单
   - 表单包含用户名、密码输入框
   - 底部需要登录按钮
2. 选择组件：
   - Form 作为容器
   - Input 用于用户名输入
   - Input.Password 用于密码输入
   - Button 用于提交表单
3. 配置组件属性：
   - 设置表单布局为垂直排列
   - 添加输入框的校验规则
   - 配置按钮的样式和加载状态
4. 优化用户体验：
   - 添加友好的标签文本
   - 配置适当的占位符
   - 设置合理的组件间距

示例 2 - 用户列表页面：
思考步骤：
1. 分析页面结构：
   - 顶部需要搜索区域
   - 中间是用户列表表格
   - 右上角需要添加用户按钮
2. 选择组件：
   - Space 用于整体布局
   - Form 用于搜索表单
   - Table 展示用户列表
   - Button 用于添加用户
3. 配置组件属性：
   - 设置表格的列配置
   - 配置搜索表单的布局
   - 添加分页配置
4. 优化用户体验：
   - 添加数据加载状态
   - 配置表格的排序和筛选
   - 优化移动端适配

现在，请根据以下需求，按照类似的思考步骤生成页面 Schema：

需求描述：
${request.description}

请按照以下步骤思考：
1. 分析页面结构：确定页面的主要区域和布局
2. 选择合适的组件：从可用组件中选择最适合的组件
3. 配置组件属性：设置组件的属性、验证规则和交互行为
4. 优化用户体验：添加必要的提示信息和帮助文本

要求：
1. 只使用提供的可用组件
2. Schema 必须是有效的 JSON 格式
3. 组件属性需符合组件定义
4. 确保生成的页面功能完整、体验良好

请直接返回 JSON 格式的 Schema，包含以下字段：
{
  "type": "page",
  "title": "页面标题",
  "components": [
    {
      "type": "组件类型",
      "props": {
        // 组件属性
      },
      "children": [
        // 子组件
      ]
    }
  ],
  "dataSource": {
    "data": {
      // 静态数据
    }
  }
}`;
  }

  /**
   * 解析响应
   */
  private parseResponse(content: string): PageSchema | null {
    try {
      // 移除 markdown 代码块标记
      const jsonStr = content.replace(/```json\n|\n```/g, '');
      const schema = JSON.parse(jsonStr);
      
      if (this.validateBasicSchema(schema)) {
        return schema;
      }
      console.error('Schema 验证失败:', schema);
      return null;
    } catch (error) {
      console.error('解析 Schema 失败:', error);
      return null;
    }
  }

  /**
   * 验证基础 Schema 结构
   */
  private validateBasicSchema(schema: any): schema is PageSchema {
    return (
      schema &&
      typeof schema === 'object' &&
      typeof schema.type === 'string' &&
      typeof schema.title === 'string' &&
      Array.isArray(schema.components)
    );
  }

  /**
   * 错误处理
   */
  private handleError(error: any): ErrorResponse {
    console.error('LowCode Service Error:', error);

    return {
      code: ErrorCode.GENERATION_FAILED,
      message: error.message || '生成失败',
      details: error,
      suggestions: [
        '检查物料列表是否正确',
        '确认需求描述是否清晰',
        '验证参考 Schema 格式'
      ]
    };
  }

  /**
   * 使用 DeepSeek 优化 Schema
   */
  private async optimizeSchemaWithDeepSeek(schema: PageSchema): Promise<PageSchema> {
    try {
      const schemaStr = JSON.stringify(schema, null, 2);
      const response = await this.llmService.optimizeSchema(schemaStr);
      
      if (!response.success || !response.content) {
        console.error('Schema 优化失败:', response.error);
        return schema;
      }

      try {
        const optimizedSchema = JSON.parse(response.content) as PageSchema;
        return optimizedSchema;
      } catch (parseError) {
        console.error('优化后的 Schema 解析失败:', parseError);
        return schema;
      }
    } catch (error) {
      console.error('Schema 优化失败:', error);
      return schema;
    }
  }

  /**
   * 验证 Schema 结构和类型
   */
  private validateSchemaStructure(schema: any): schema is PageSchema {
    if (!schema || typeof schema !== 'object') {
      return false;
    }

    // 基本属性验证
    if (!schema.version || typeof schema.version !== 'string') {
      return false;
    }

    if (!schema.components || !Array.isArray(schema.components)) {
      return false;
    }

    return true;
  }

  /**
   * 验证 Schema 与物料的兼容性
   */
  public async validateSchemaWithMaterials(schema: any, materials: string[]): Promise<any> {
    // 验证 schema 结构
    if (!this.validateSchemaStructure(schema)) {
      throw new Error('Invalid schema structure');
    }

    // 验证组件与物料的兼容性
    const materialSet = new Set(materials);
    const validateComponent = (component: any): boolean => {
      if (!component || !component.type) {
        return false;
      }
      return materialSet.has(component.type);
    };

    // 递归验证所有组件
    const validateComponents = (components: any[]): boolean => {
      return components.every(component => {
        const isValid = validateComponent(component);
        if (component.children) {
          return isValid && validateComponents(component.children);
        }
        return isValid;
      });
    };

    if (!validateComponents(schema.components)) {
      throw new Error('Schema contains incompatible components');
    }

    return schema;
  }

  /**
   * 优化 Schema 的组件结构和属性
   */
  public async optimizeSchemaStructure(schema: any, componentName: string): Promise<any> {
    // 验证 schema 结构
    if (!this.validateSchemaStructure(schema)) {
      throw new Error('Invalid schema structure');
    }

    // 根据组件名称优化 schema
    const schemaWithContext = {
      ...schema,
      componentContext: {
        name: componentName,
        protocol: this.materialProtocol
      }
    };

    const schemaStr = JSON.stringify(schemaWithContext, null, 2);
    const response = await this.llmService.optimizeSchema(schemaStr);

    if (!response.success || !response.content) {
      throw new Error(response.error || 'Schema optimization failed');
    }

    try {
      return JSON.parse(response.content);
    } catch (error) {
      throw new Error('Failed to parse optimized schema');
    }
  }
} 