import { SlotsRegistry } from '../interfaces/slots';

// 组件属性定义
interface ComponentPropDefinition {
  type: string;
  required?: boolean;
  description?: string;
}

// 组件定义
interface ComponentDefinition {
  props?: Record<string, ComponentPropDefinition>;
  requiredProps?: string[];
  description?: string;
}

// 组件注册表
export const ComponentRegistry: Record<string, ComponentDefinition> = {
  Card: {
    props: {
      title: {
        type: 'string',
        description: '卡片标题'
      },
      bordered: {
        type: 'boolean',
        description: '是否显示边框'
      }
    },
    requiredProps: ['title']
  },
  Layout: {
    props: {
      direction: {
        type: 'string',
        description: '布局方向'
      },
      gap: {
        type: 'number',
        description: '间距'
      }
    }
  },
  Form: {
    props: {
      layout: {
        type: 'string',
        description: '表单布局'
      },
      labelWidth: {
        type: 'number',
        description: '标签宽度'
      }
    }
  },
  List: {
    props: {
      dataSource: {
        type: 'array',
        description: '数据源'
      },
      renderItem: {
        type: 'function',
        description: '渲染列表项的函数'
      }
    },
    requiredProps: ['dataSource', 'renderItem']
  },
  Dialog: {
    props: {
      visible: {
        type: 'boolean',
        description: '是否可见'
      },
      title: {
        type: 'string',
        description: '对话框标题'
      },
      width: {
        type: 'number',
        description: '对话框宽度'
      }
    },
    requiredProps: ['visible']
  },
  JSSlot: {
    props: {
      name: {
        type: 'string',
        description: '插槽名称'
      }
    },
    requiredProps: ['name']
  }
};

// 组件插槽注册表
export const COMPONENT_SLOTS_REGISTRY: SlotsRegistry = {
  // 示例组件插槽配置
  Card: {
    header: {
      name: 'header',
      type: 'JSX',
      description: '卡片头部内容',
      required: false
    },
    content: {
      name: 'content',
      type: 'JSX',
      description: '卡片主要内容',
      required: true
    },
    footer: {
      name: 'footer',
      type: 'JSX',
      description: '卡片底部内容',
      required: false
    }
  },
  
  // 布局组件插槽配置
  Layout: {
    header: {
      name: 'header',
      type: 'JSX',
      description: '页面头部内容',
      required: false
    },
    sidebar: {
      name: 'sidebar',
      type: 'JSX',
      description: '侧边栏内容',
      required: false
    },
    content: {
      name: 'content',
      type: 'JSX',
      description: '主要内容区域',
      required: true
    },
    footer: {
      name: 'footer',
      type: 'JSX',
      description: '页面底部内容',
      required: false
    }
  },

  // 表单组件插槽配置
  Form: {
    header: {
      name: 'header',
      type: 'JSX',
      description: '表单头部内容',
      required: false
    },
    fields: {
      name: 'fields',
      type: 'array',
      description: '表单字段列表',
      required: true,
      validation: {
        type: 'array',
        rules: [
          { type: 'required' },
          { type: 'min', value: 1 }
        ]
      }
    },
    footer: {
      name: 'footer',
      type: 'JSX',
      description: '表单底部内容',
      required: false
    }
  },

  // 列表组件插槽配置
  List: {
    header: {
      name: 'header',
      type: 'JSX',
      description: '列表头部内容',
      required: false
    },
    item: {
      name: 'item',
      type: 'JSX',
      description: '列表项模板',
      required: true
    },
    empty: {
      name: 'empty',
      type: 'JSX',
      description: '空状态显示内容',
      required: false
    },
    footer: {
      name: 'footer',
      type: 'JSX',
      description: '列表底部内容',
      required: false
    }
  },

  // 对话框组件插槽配置
  Dialog: {
    title: {
      name: 'title',
      type: 'JSX',
      description: '对话框标题',
      required: true
    },
    content: {
      name: 'content',
      type: 'JSX',
      description: '对话框内容',
      required: true
    },
    footer: {
      name: 'footer',
      type: 'JSX',
      description: '对话框底部按钮区域',
      required: false
    }
  }
}; 