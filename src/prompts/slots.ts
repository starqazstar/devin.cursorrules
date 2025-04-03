// 基础插槽示例
export const BASIC_SLOT_EXAMPLE = {
  type: 'Card',
  props: {
    title: '卡片标题'
  },
  children: [
    {
      type: 'JSSlot',
      name: 'content',
      children: [
        {
          type: 'Text',
          props: {
            content: '这是卡片内容'
          }
        }
      ]
    }
  ]
};

// 生成提示词
export const GENERATION_PROMPT = `请根据以下要求生成页面 Schema：
1. 使用组件插槽时，必须指定 type: 'JSSlot' 和 name 属性
2. 插槽必须包含至少一个子组件
3. 插槽名称必须与组件定义中的插槽名称匹配
4. 插槽内的组件必须符合组件类型和属性要求

示例：
${JSON.stringify(BASIC_SLOT_EXAMPLE, null, 2)}

注意事项：
- 确保所有必需的属性都已设置
- 检查属性类型是否正确
- 验证插槽名称是否有效
- 确保组件嵌套结构合理`;

// 优化提示词
export const OPTIMIZATION_PROMPT = `请根据以下规则优化页面 Schema：
1. 检查并优化插槽的使用
2. 确保插槽内容的合理性
3. 验证组件属性的完整性
4. 优化组件嵌套结构

优化建议：
- 移除不必要的嵌套层级
- 合并类似的组件结构
- 补充缺失的必需属性
- 调整不合理的属性值`; 