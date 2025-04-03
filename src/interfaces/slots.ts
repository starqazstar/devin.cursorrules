// 插槽类型定义
export interface SlotDefinition {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  defaultValue?: any;
  validation?: {
    type: string;
    rules: any[];
  };
}

// 组件插槽配置
export interface ComponentSlots {
  [key: string]: SlotDefinition;
}

// 插槽注册表
export interface SlotsRegistry {
  [componentName: string]: ComponentSlots;
}

// 插槽验证错误
export interface SlotValidationError {
  componentName: string;
  slotName: string;
  message: string;
  path?: string[];
}

// 插槽验证器类
export class SlotValidator {
  private registry: SlotsRegistry;

  constructor(registry: SlotsRegistry) {
    this.registry = registry;
  }

  // 验证组件的插槽
  validateComponentSlots(
    componentName: string,
    slots: Record<string, any>,
    path: string[] = []
  ): SlotValidationError[] {
    const errors: SlotValidationError[] = [];
    const componentSlots = this.registry[componentName];

    if (!componentSlots) {
      return [{
        componentName,
        slotName: '',
        message: `Component "${componentName}" not found in slots registry`,
        path
      }];
    }

    // 检查必需的插槽
    for (const [slotName, slotDef] of Object.entries(componentSlots)) {
      if (slotDef.required && !slots[slotName]) {
        errors.push({
          componentName,
          slotName,
          message: `Required slot "${slotName}" is missing`,
          path: [...path, slotName]
        });
      }
    }

    // 检查提供的插槽是否有效
    for (const [slotName, slotValue] of Object.entries(slots)) {
      const slotDef = componentSlots[slotName];
      if (!slotDef) {
        errors.push({
          componentName,
          slotName,
          message: `Unknown slot "${slotName}"`,
          path: [...path, slotName]
        });
        continue;
      }

      // 验证插槽值
      if (slotDef.validation) {
        const validationErrors = this.validateSlotValue(
          slotValue,
          slotDef.validation,
          [...path, slotName]
        );
        errors.push(...validationErrors);
      }
    }

    return errors;
  }

  // 验证插槽值
  private validateSlotValue(
    value: any,
    validation: { type: string; rules: any[] },
    path: string[]
  ): SlotValidationError[] {
    const errors: SlotValidationError[] = [];

    // 类型检查
    if (!this.checkType(value, validation.type)) {
      errors.push({
        componentName: path[0],
        slotName: path[path.length - 1],
        message: `Invalid type: expected "${validation.type}"`,
        path
      });
    }

    // 应用验证规则
    for (const rule of validation.rules) {
      const error = this.applyValidationRule(value, rule, path);
      if (error) {
        errors.push(error);
      }
    }

    return errors;
  }

  // 检查值的类型
  private checkType(value: any, expectedType: string): boolean {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number';
      case 'boolean':
        return typeof value === 'boolean';
      case 'object':
        return typeof value === 'object' && value !== null;
      case 'array':
        return Array.isArray(value);
      default:
        return true; // 未知类型默认通过
    }
  }

  // 应用验证规则
  private applyValidationRule(
    value: any,
    rule: any,
    path: string[]
  ): SlotValidationError | null {
    // 根据规则类型进行验证
    switch (rule.type) {
      case 'required':
        if (value === undefined || value === null || value === '') {
          return {
            componentName: path[0],
            slotName: path[path.length - 1],
            message: 'Value is required',
            path
          };
        }
        break;
      case 'min':
        if (typeof value === 'number' && value < rule.value) {
          return {
            componentName: path[0],
            slotName: path[path.length - 1],
            message: `Value must be greater than or equal to ${rule.value}`,
            path
          };
        }
        break;
      case 'max':
        if (typeof value === 'number' && value > rule.value) {
          return {
            componentName: path[0],
            slotName: path[path.length - 1],
            message: `Value must be less than or equal to ${rule.value}`,
            path
          };
        }
        break;
      case 'pattern':
        if (typeof value === 'string' && !new RegExp(rule.value).test(value)) {
          return {
            componentName: path[0],
            slotName: path[path.length - 1],
            message: 'Value does not match pattern',
            path
          };
        }
        break;
    }
    return null;
  }
}

// 默认导出 SlotValidator 类
export default SlotValidator;

// 组件 Schema 定义
export interface ComponentSchema {
  type: string;
  props?: Record<string, any>;
  children?: ComponentSchema[];
  id?: string;
}

// JSSlot 组件定义
export interface JSSlot extends ComponentSchema {
  type: 'JSSlot';
  name: string;
  children: ComponentSchema[];
} 