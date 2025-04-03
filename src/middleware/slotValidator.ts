import { Context, Next } from 'koa';
import SlotValidator, { SlotValidationError } from '../interfaces/slots';
import { COMPONENT_SLOTS_REGISTRY } from '../constants/slots';

// 递归验证 schema 中的插槽
function validateSchemaSlots(
  schema: any,
  validator: SlotValidator,
  path: string[] = []
): SlotValidationError[] {
  const errors: SlotValidationError[] = [];

  if (!schema || typeof schema !== 'object') {
    return errors;
  }

  // 如果是 JSSlot 组件，验证其插槽
  if (schema.type === 'JSSlot') {
    const componentErrors = validator.validateComponentSlots(
      schema.componentName,
      schema.slots || {},
      path
    );
    errors.push(...componentErrors);
  }

  // 递归检查子节点
  for (const [key, value] of Object.entries(schema)) {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const childErrors = validateSchemaSlots(
          item,
          validator,
          [...path, key, index.toString()]
        );
        errors.push(...childErrors);
      });
    } else if (value && typeof value === 'object') {
      const childErrors = validateSchemaSlots(
        value,
        validator,
        [...path, key]
      );
      errors.push(...childErrors);
    }
  }

  return errors;
}

// 插槽验证中间件
export async function validateSlots(ctx: Context, next: Next) {
  const { body } = ctx.request;

  // 检查请求体中是否包含 schema
  if (!body?.schema) {
    ctx.throw(400, 'Missing schema in request body');
    return;
  }

  // 创建验证器实例
  const validator = new SlotValidator(COMPONENT_SLOTS_REGISTRY);

  // 验证 schema 中的所有插槽
  const errors = validateSchemaSlots(body.schema, validator);

  // 如果存在验证错误，返回错误信息
  if (errors.length > 0) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      errors: errors.map(error => ({
        ...error,
        path: error.path?.join('.'),
      })),
    };
    return;
  }

  // 验证通过，继续处理请求
  await next();
} 