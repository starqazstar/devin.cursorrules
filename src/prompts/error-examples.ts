// 常见错误示例和解决方案
export const ERROR_EXAMPLES = {
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
export const ERROR_SOLUTIONS = {
  slotName: (name: string) => `
发现问题：插槽名称 "${name}" 无效
可能原因：
1. 插槽名称拼写错误
2. 使用了未定义的插槽
3. 组件不支持该插槽

解决方案：
1. 检查组件文档中支持的插槽列表
2. 确保插槽名称拼写正确
3. 使用组件提供的标准插槽名称`,

  emptyChildren: `
发现问题：插槽缺少子组件
可能原因：
1. 忘记添加子组件
2. 子组件被误删除
3. 数据结构不完整

解决方案：
1. 添加至少一个有效的子组件
2. 参考示例中的正确用法
3. 检查数据完整性`,

  invalidType: (type: string) => `
发现问题：无效的组件类型 "${type}"
可能原因：
1. 组件名称拼写错误
2. 使用了未注册的组件
3. 组件库未正确引入

解决方案：
1. 检查组件名称拼写
2. 查看已注册的组件列表
3. 确保组件已在物料库中注册`
}; 