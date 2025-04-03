import { describe, it, expect, beforeEach } from 'vitest';
import { RuntimeValidator } from '../../validators/RuntimeValidator';
import { ComponentSchema, JSSlot } from '../../interfaces/slots';

describe('RuntimeValidator', () => {
  let validator: RuntimeValidator;

  beforeEach(() => {
    validator = RuntimeValidator.getInstance();
    validator.clearCache();
  });

  describe('validate', () => {
    it('should validate a simple component schema', () => {
      const schema: ComponentSchema = {
        type: 'Card',
        props: {
          title: 'Test Card'
        }
      };

      const result = validator.validate(schema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect unknown component type', () => {
      const schema: ComponentSchema = {
        type: 'UnknownComponent',
        props: {}
      };

      const result = validator.validate(schema);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('未知的组件类型');
    });

    it('should validate JSSlot component', () => {
      const schema: JSSlot = {
        type: 'JSSlot',
        name: 'content',
        children: [
          {
            type: 'Card',
            props: {
              title: 'Child Card'
            }
          }
        ]
      };

      const result = validator.validate(schema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing required props', () => {
      const schema: ComponentSchema = {
        type: 'Card',
        props: {}
      };

      const result = validator.validate(schema);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('缺少必需属性');
    });

    it('should validate nested components', () => {
      const schema: ComponentSchema = {
        type: 'Layout',
        props: {
          direction: 'vertical'
        },
        children: [
          {
            type: 'Card',
            props: {
              title: 'Card 1'
            }
          },
          {
            type: 'Card',
            props: {
              title: 'Card 2'
            }
          }
        ]
      };

      const result = validator.validate(schema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate prop types', () => {
      const schema: ComponentSchema = {
        type: 'Card',
        props: {
          title: 123, // 应该是字符串
          bordered: 'true' // 应该是布尔值
        }
      };

      const result = validator.validate(schema);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].message).toContain('属性类型错误');
    });
  });

  describe('cache', () => {
    it('should cache validation results', () => {
      const schema: ComponentSchema = {
        type: 'Card',
        props: {
          title: 'Test Card'
        }
      };

      // 第一次验证
      const result1 = validator.validate(schema);
      const stats1 = validator.getPerformanceStats();

      // 第二次验证
      const result2 = validator.validate(schema);
      const stats2 = validator.getPerformanceStats();

      expect(result1).toEqual(result2);
      expect(stats2.cacheHits).toBe(1);
      expect(stats2.cacheMisses).toBe(1);
    });

    it('should limit cache size', () => {
      // 生成大量不同的组件进行验证
      for (let i = 0; i < 1100; i++) {
        const schema: ComponentSchema = {
          type: 'Card',
          props: {
            title: `Card ${i}`
          }
        };
        validator.validate(schema);
      }

      const stats = validator.getPerformanceStats();
      expect(stats.cacheSize).toBeLessThanOrEqual(1000);
    });
  });

  describe('debug mode', () => {
    it('should provide debug information when enabled', () => {
      const schema: ComponentSchema = {
        type: 'Layout',
        props: {
          direction: 'vertical'
        },
        children: [
          {
            type: 'Card',
            props: {
              title: 'Test Card'
            }
          }
        ]
      };

      const result = validator.validate(schema, true);
      expect(result.debug).toBeDefined();
      expect(result.debug?.validationTrace).toHaveLength(2); // Layout + Card
      expect(result.debug?.cacheStats).toBeDefined();
    });

    it('should track validation time', () => {
      const schema: ComponentSchema = {
        type: 'Card',
        props: {
          title: 'Test Card'
        }
      };

      const result = validator.validate(schema, true);
      expect(result.performance.duration).toBeGreaterThan(0);
      expect(result.performance.componentsChecked).toBe(1);
    });
  });
}); 