/**
 * 低代码平台物料数据接口
 */
export interface MaterialData {
  componentName: string;     // 组件名称
  id: string;               // 组件唯一标识
  props: Record<string, any>; // 组件属性
  hidden?: boolean;         // 是否隐藏
  title?: string;          // 组件标题
  isLocked?: boolean;      // 是否锁定
  condition?: boolean;     // 条件
  conditionGroup?: string; // 条件组
  children?: MaterialData[]; // 子组件
  i18n?: Record<string, Record<string, string>>; // 国际化配置
  style?: Record<string, any>; // 样式配置
  events?: Record<string, string>; // 事件处理
  validators?: Array<{      // 验证规则
    type: string;          // 验证类型
    message: string;       // 错误信息
    params?: any;         // 验证参数
  }>;
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
  description: string;      // 页面功能描述
  components: string[];     // 可用组件列表
  options?: {
    template?: string;     // 页面模板
    theme?: string;       // 主题配置
    i18n?: boolean;      // 是否支持国际化
  };
}

/**
 * 错误码枚举
 */
export enum ErrorCode {
  INVALID_SCHEMA = 'INVALID_SCHEMA',       // Schema 格式错误
  UNKNOWN_COMPONENT = 'UNKNOWN_COMPONENT', // 未知组件
  INVALID_PROPS = 'INVALID_PROPS',        // 属性错误
  GENERATION_FAILED = 'GENERATION_FAILED', // 生成失败
  INVALID_REQUEST = 'INVALID_REQUEST',    // 请求参数错误
  UNAUTHORIZED = 'UNAUTHORIZED',          // 未授权
  NOT_FOUND = 'NOT_FOUND',               // 资源未找到
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED', // 超出请求限制
  INTERNAL_ERROR = 'INTERNAL_ERROR',      // 内部错误
  VALIDATION_ERROR = 'VALIDATION_ERROR'   // 验证错误
}

/**
 * 错误响应接口
 */
export interface ErrorResponse {
  code: ErrorCode;          // 错误码
  message: string;         // 错误信息
  details?: any;          // 错误详情
  suggestions?: string[]; // 修复建议
  timestamp?: number;    // 错误时间戳
  requestId?: string;   // 请求 ID
}

/**
 * 页面生成响应接口
 */
export interface PageGenerationResponse {
  success: boolean;         // 是否成功
  data?: MaterialData;      // 生成的页面 Schema
  error?: ErrorResponse;    // 错误信息
  meta?: {
    generationTime: number; // 生成耗时
    modelUsed: string;     // 使用的模型
    promptTokens: number;  // 提示词 token 数
    totalTokens: number;   // 总 token 数
  };
}

/**
 * Function Call 接口定义
 */
export interface FunctionCall {
  name: string;           // 函数名称
  description: string;    // 函数描述
  parameters: {           // 函数参数
    type: string;        // 参数类型
    properties: Record<string, {
      type: string;      // 属性类型
      description: string; // 属性描述
      required?: boolean; // 是否必须
    }>;
    required: string[];   // 必须的参数列表
  };
}

/**
 * 组件生成函数定义
 */
export const generatePageSchema: FunctionCall = {
  name: 'generatePageSchema',
  description: '根据物料列表和需求描述生成页面 Schema',
  parameters: {
    type: 'object',
    properties: {
      materials: {
        type: 'array',
        description: '可用物料列表',
        required: true
      },
      description: {
        type: 'string',
        description: '页面需求描述',
        required: true
      },
      referenceSchema: {
        type: 'object',
        description: '参考 Schema',
        required: false
      }
    },
    required: ['materials', 'description']
  }
};

/**
 * Schema 验证函数定义
 */
export const validateSchema: FunctionCall = {
  name: 'validateSchema',
  description: '验证生成的 Schema 是否符合规范',
  parameters: {
    type: 'object',
    properties: {
      schema: {
        type: 'object',
        description: '待验证的 Schema',
        required: true
      },
      materials: {
        type: 'array',
        description: '可用物料列表',
        required: true
      }
    },
    required: ['schema', 'materials']
  }
};

/**
 * 组件属性优化函数定义
 */
export const optimizeProps: FunctionCall = {
  name: 'optimizeProps',
  description: '优化组件属性配置',
  parameters: {
    type: 'object',
    properties: {
      schema: {
        type: 'object',
        description: '待优化的 Schema',
        required: true
      },
      componentName: {
        type: 'string',
        description: '组件名称',
        required: true
      }
    },
    required: ['schema', 'componentName']
  }
};

/**
 * 页面 Schema 接口
 */
export interface PageSchema {
  type: string;           // 页面类型
  title: string;         // 页面标题
  components: Array<{    // 组件列表
    type: string;       // 组件类型
    props: Record<string, any>; // 组件属性
    children?: any[];  // 子组件
  }>;
  dataSource?: {        // 数据源
    data: Record<string, any>; // 静态数据
  };
  layout?: {           // 布局配置
    type: string;     // 布局类型
    props: any;      // 布局属性
  };
  theme?: {          // 主题配置
    primary: string; // 主色
    layout: string; // 布局主题
  };
  i18n?: {         // 国际化配置
    defaultLocale: string;
    locales: string[];
    messages: Record<string, Record<string, string>>;
  };
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

/**
 * 性能监控数据接口
 */
export interface PerformanceData {
  requestCount: number;     // 请求总数
  averageResponseTime: number; // 平均响应时间
  errorCount: number;        // 错误次数
  slowRequestCount: number;  // 慢请求次数
}

/**
 * 缓存配置接口
 */
export interface CacheConfig {
  enabled: boolean;        // 是否启用缓存
  ttl: number;           // 缓存时间
  maxSize: number;      // 最大缓存数量
}

/**
 * 监控配置接口
 */
export interface MonitoringConfig {
  enabled: boolean;       // 是否启用监控
  logLevel: string;      // 日志级别
  slowThreshold: number; // 慢请求阈值
} 