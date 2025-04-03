/**
 * 低代码平台协议接口定义
 */
/**
 * 低代码平台 Function Call 定义
 */
export var lowcodeFunctions = {
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
