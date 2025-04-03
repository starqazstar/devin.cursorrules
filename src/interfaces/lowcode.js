/**
 * 错误码枚举
 */
export var ErrorCode;
(function (ErrorCode) {
    ErrorCode["INVALID_SCHEMA"] = "INVALID_SCHEMA";
    ErrorCode["UNKNOWN_COMPONENT"] = "UNKNOWN_COMPONENT";
    ErrorCode["INVALID_PROPS"] = "INVALID_PROPS";
    ErrorCode["GENERATION_FAILED"] = "GENERATION_FAILED";
    ErrorCode["INVALID_REQUEST"] = "INVALID_REQUEST";
    ErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ErrorCode["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
    ErrorCode["INTERNAL_ERROR"] = "INTERNAL_ERROR";
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR"; // 验证错误
})(ErrorCode || (ErrorCode = {}));
/**
 * 组件生成函数定义
 */
export var generatePageSchema = {
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
export var validateSchema = {
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
export var optimizeProps = {
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
