// 国际化错误提示
export const ERROR_MESSAGES = {
  zh_CN: {
    invalidSlotName: {
      title: '无效的插槽名称',
      description: '插槽名称 "{name}" 不存在于当前组件定义中',
      causes: [
        '插槽名称拼写错误',
        '使用了未定义的插槽',
        '组件不支持该插槽'
      ],
      solutions: [
        '检查组件文档中支持的插槽列表',
        '确保插槽名称拼写正确',
        '使用组件提供的标准插槽名称'
      ]
    },
    emptySlot: {
      title: '空插槽',
      description: '插槽必须包含至少一个子组件',
      causes: [
        '忘记添加子组件',
        '子组件被误删除',
        '数据结构不完整'
      ],
      solutions: [
        '添加至少一个有效的子组件',
        '参考示例中的正确用法',
        '检查数据完整性'
      ]
    },
    invalidChildType: {
      title: '无效的子组件类型',
      description: '组件类型 "{type}" 不存在于物料库中',
      causes: [
        '组件名称拼写错误',
        '使用了未注册的组件',
        '组件库未正确引入'
      ],
      solutions: [
        '检查组件名称拼写',
        '查看已注册的组件列表',
        '确保组件已在物料库中注册'
      ]
    }
  },
  en_US: {
    invalidSlotName: {
      title: 'Invalid Slot Name',
      description: 'Slot name "{name}" does not exist in current component definition',
      causes: [
        'Slot name misspelled',
        'Undefined slot used',
        'Component does not support this slot'
      ],
      solutions: [
        'Check supported slots in component documentation',
        'Ensure correct slot name spelling',
        'Use standard slot names provided by the component'
      ]
    },
    emptySlot: {
      title: 'Empty Slot',
      description: 'Slot must contain at least one child component',
      causes: [
        'Forgot to add child components',
        'Child components accidentally deleted',
        'Incomplete data structure'
      ],
      solutions: [
        'Add at least one valid child component',
        'Reference correct usage in examples',
        'Check data integrity'
      ]
    },
    invalidChildType: {
      title: 'Invalid Child Component Type',
      description: 'Component type "{type}" does not exist in material library',
      causes: [
        'Component name misspelled',
        'Unregistered component used',
        'Component library not properly imported'
      ],
      solutions: [
        'Check component name spelling',
        'View list of registered components',
        'Ensure component is registered in material library'
      ]
    }
  }
};

// 获取错误消息
export function getErrorMessage(
  locale: 'zh_CN' | 'en_US',
  errorType: keyof typeof ERROR_MESSAGES.zh_CN,
  params?: Record<string, string>
): typeof ERROR_MESSAGES.zh_CN[keyof typeof ERROR_MESSAGES.zh_CN] {
  const message = ERROR_MESSAGES[locale][errorType];
  if (params) {
    return {
      ...message,
      description: message.description.replace(
        /\{(\w+)\}/g,
        (_, key) => params[key] || `{${key}}`
      )
    };
  }
  return message;
} 