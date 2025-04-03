// 常见错误示例和解决方案
export var ERROR_EXAMPLES = {
    // 插槽名称错误
    invalidSlotName: {
        error: {
            type: 'JSSlot',
            name: 'invalid_slot',
            children: []
        },
        message: '插槽名称 "invalid_slot" 不存在于当前组件定义中',
        solution: '请检查组件定义中支持的插槽名称，确保使用正确的插槽名'
    },
    // 缺少必需子组件
    emptySlot: {
        error: {
            type: 'JSSlot',
            name: 'content',
            children: []
        },
        message: '插槽必须包含至少一个子组件',
        solution: '请在插槽中添加有效的子组件'
    },
    // 无效的子组件类型
    invalidChildType: {
        error: {
            type: 'JSSlot',
            name: 'content',
            children: [
                {
                    type: 'InvalidComponent',
                    props: {}
                }
            ]
        },
        message: '组件类型 "InvalidComponent" 不存在于物料库中',
        solution: '请使用物料库中已注册的有效组件类型'
    }
};
// 错误修复建议模板
export var ERROR_SOLUTIONS = {
    slotName: function (name) { return "\n\u53D1\u73B0\u95EE\u9898\uFF1A\u63D2\u69FD\u540D\u79F0 \"".concat(name, "\" \u65E0\u6548\n\u53EF\u80FD\u539F\u56E0\uFF1A\n1. \u63D2\u69FD\u540D\u79F0\u62FC\u5199\u9519\u8BEF\n2. \u4F7F\u7528\u4E86\u672A\u5B9A\u4E49\u7684\u63D2\u69FD\n3. \u7EC4\u4EF6\u4E0D\u652F\u6301\u8BE5\u63D2\u69FD\n\n\u89E3\u51B3\u65B9\u6848\uFF1A\n1. \u68C0\u67E5\u7EC4\u4EF6\u6587\u6863\u4E2D\u652F\u6301\u7684\u63D2\u69FD\u5217\u8868\n2. \u786E\u4FDD\u63D2\u69FD\u540D\u79F0\u62FC\u5199\u6B63\u786E\n3. \u4F7F\u7528\u7EC4\u4EF6\u63D0\u4F9B\u7684\u6807\u51C6\u63D2\u69FD\u540D\u79F0"); },
    emptyChildren: "\n\u53D1\u73B0\u95EE\u9898\uFF1A\u63D2\u69FD\u7F3A\u5C11\u5B50\u7EC4\u4EF6\n\u53EF\u80FD\u539F\u56E0\uFF1A\n1. \u5FD8\u8BB0\u6DFB\u52A0\u5B50\u7EC4\u4EF6\n2. \u5B50\u7EC4\u4EF6\u88AB\u8BEF\u5220\u9664\n3. \u6570\u636E\u7ED3\u6784\u4E0D\u5B8C\u6574\n\n\u89E3\u51B3\u65B9\u6848\uFF1A\n1. \u6DFB\u52A0\u81F3\u5C11\u4E00\u4E2A\u6709\u6548\u7684\u5B50\u7EC4\u4EF6\n2. \u53C2\u8003\u793A\u4F8B\u4E2D\u7684\u6B63\u786E\u7528\u6CD5\n3. \u68C0\u67E5\u6570\u636E\u5B8C\u6574\u6027",
    invalidType: function (type) { return "\n\u53D1\u73B0\u95EE\u9898\uFF1A\u65E0\u6548\u7684\u7EC4\u4EF6\u7C7B\u578B \"".concat(type, "\"\n\u53EF\u80FD\u539F\u56E0\uFF1A\n1. \u7EC4\u4EF6\u540D\u79F0\u62FC\u5199\u9519\u8BEF\n2. \u4F7F\u7528\u4E86\u672A\u6CE8\u518C\u7684\u7EC4\u4EF6\n3. \u7EC4\u4EF6\u5E93\u672A\u6B63\u786E\u5F15\u5165\n\n\u89E3\u51B3\u65B9\u6848\uFF1A\n1. \u68C0\u67E5\u7EC4\u4EF6\u540D\u79F0\u62FC\u5199\n2. \u67E5\u770B\u5DF2\u6CE8\u518C\u7684\u7EC4\u4EF6\u5217\u8868\n3. \u786E\u4FDD\u7EC4\u4EF6\u5DF2\u5728\u7269\u6599\u5E93\u4E2D\u6CE8\u518C"); }
};
