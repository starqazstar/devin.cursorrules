/**
 * 低代码平台协议接口定义
 */

/**
 * 组件属性定义
 */
export interface ComponentPropDefinition {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function';
  title: string;
  description?: string;
  default?: any;
  required?: boolean;
  validator?: string;
  format?: string;
  items?: ComponentPropDefinition; // 用于数组类型
  properties?: Record<string, ComponentPropDefinition>; // 用于对象类型
  enum?: any[];
  enumNames?: string[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

/**
 * 组件定义
 */
export interface ComponentDefinition {
  name: string;
  title: string;
  description?: string;
  icon?: string;
  category?: string;
  props: Record<string, ComponentPropDefinition>;
  events?: Record<string, {
    description: string;
    parameters?: Record<string, ComponentPropDefinition>;
  }>;
  slots?: Record<string, {
    description: string;
    scope?: Record<string, ComponentPropDefinition>;
  }>;
  methods?: Record<string, {
    description: string;
    parameters?: Record<string, ComponentPropDefinition>;
    returns?: ComponentPropDefinition;
  }>;
}

/**
 * 物料协议
 */
export interface MaterialProtocol {
  version: string;
  components: ComponentDefinition[];
  categories: Array<{
    name: string;
    title: string;
    components: string[];
  }>;
}

/**
 * 页面协议
 */
export interface PageProtocol {
  version: string;
  title: string;
  description?: string;
  components: Array<{
    id: string;
    type: string;
    props: Record<string, any>;
    style?: Record<string, any>;
    events?: Record<string, string | Function>;
    children?: PageProtocol['components'];
  }>;
  dataSource?: {
    list: Array<{
      id: string;
      type: 'api' | 'static';
      options: {
        url?: string;
        method?: string;
        data?: Record<string, any>;
        headers?: Record<string, string>;
        params?: Record<string, any>;
      };
    }>;
    relations: Array<{
      from: string;
      to: string;
      mapping: Record<string, string>;
    }>;
  };
  state?: {
    initial: Record<string, any>;
    computed: Record<string, string>;
  };
  methods?: Record<string, string | Function>;
  lifeCycles?: {
    created?: string | Function;
    mounted?: string | Function;
    updated?: string | Function;
    destroyed?: string | Function;
  };
}

/**
 * 低代码平台 Function Call 定义
 */
export const lowcodeFunctions = {
  /**
   * 生成页面
   */
  generatePage: {
    name: 'generatePage',
    description: '根据需求描述和可用组件生成页面',
    parameters: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: '页面需求描述'
        },
        components: {
          type: 'array',
          description: '可用组件列表',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              props: { type: 'object' }
            }
          }
        },
        template: {
          type: 'object',
          description: '页面模板（可选）'
        }
      },
      required: ['description', 'components']
    }
  },

  /**
   * 更新组件属性
   */
  updateProps: {
    name: 'updateProps',
    description: '更新组件属性',
    parameters: {
      type: 'object',
      properties: {
        componentId: {
          type: 'string',
          description: '组件 ID'
        },
        props: {
          type: 'object',
          description: '新的属性值'
        }
      },
      required: ['componentId', 'props']
    }
  },

  /**
   * 添加数据源
   */
  addDataSource: {
    name: 'addDataSource',
    description: '添加数据源',
    parameters: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['api', 'static'],
          description: '数据源类型'
        },
        options: {
          type: 'object',
          description: '数据源配置'
        }
      },
      required: ['type', 'options']
    }
  },

  /**
   * 添加事件处理
   */
  addEventHandler: {
    name: 'addEventHandler',
    description: '添加事件处理器',
    parameters: {
      type: 'object',
      properties: {
        componentId: {
          type: 'string',
          description: '组件 ID'
        },
        event: {
          type: 'string',
          description: '事件名称'
        },
        handler: {
          type: 'string',
          description: '事件处理代码'
        }
      },
      required: ['componentId', 'event', 'handler']
    }
  }
};

/**
 * 低代码平台响应格式
 */
export interface LowCodeResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    requestId: string;
    timestamp: number;
    duration: number;
  };
} 