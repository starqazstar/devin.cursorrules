import { describe, it, expect, beforeEach } from 'vitest';
import { RuntimeValidator } from '../../validators/RuntimeValidator';
describe('RuntimeValidator', function () {
    var validator;
    beforeEach(function () {
        validator = RuntimeValidator.getInstance();
        validator.clearCache();
    });
    describe('validate', function () {
        it('should validate a simple component schema', function () {
            var schema = {
                type: 'Card',
                props: {
                    title: 'Test Card'
                }
            };
            var result = validator.validate(schema);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('should detect unknown component type', function () {
            var schema = {
                type: 'UnknownComponent',
                props: {}
            };
            var result = validator.validate(schema);
            expect(result.isValid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].message).toContain('未知的组件类型');
        });
        it('should validate JSSlot component', function () {
            var schema = {
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
            var result = validator.validate(schema);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('should detect missing required props', function () {
            var schema = {
                type: 'Card',
                props: {}
            };
            var result = validator.validate(schema);
            expect(result.isValid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].message).toContain('缺少必需属性');
        });
        it('should validate nested components', function () {
            var schema = {
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
            var result = validator.validate(schema);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('should validate prop types', function () {
            var schema = {
                type: 'Card',
                props: {
                    title: 123, // 应该是字符串
                    bordered: 'true' // 应该是布尔值
                }
            };
            var result = validator.validate(schema);
            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors[0].message).toContain('属性类型错误');
        });
    });
    describe('cache', function () {
        it('should cache validation results', function () {
            var schema = {
                type: 'Card',
                props: {
                    title: 'Test Card'
                }
            };
            // 第一次验证
            var result1 = validator.validate(schema);
            var stats1 = validator.getPerformanceStats();
            // 第二次验证
            var result2 = validator.validate(schema);
            var stats2 = validator.getPerformanceStats();
            expect(result1).toEqual(result2);
            expect(stats2.cacheHits).toBe(1);
            expect(stats2.cacheMisses).toBe(1);
        });
        it('should limit cache size', function () {
            // 生成大量不同的组件进行验证
            for (var i = 0; i < 1100; i++) {
                var schema = {
                    type: 'Card',
                    props: {
                        title: "Card ".concat(i)
                    }
                };
                validator.validate(schema);
            }
            var stats = validator.getPerformanceStats();
            expect(stats.cacheSize).toBeLessThanOrEqual(1000);
        });
    });
    describe('debug mode', function () {
        it('should provide debug information when enabled', function () {
            var _a, _b;
            var schema = {
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
            var result = validator.validate(schema, true);
            expect(result.debug).toBeDefined();
            expect((_a = result.debug) === null || _a === void 0 ? void 0 : _a.validationTrace).toHaveLength(2); // Layout + Card
            expect((_b = result.debug) === null || _b === void 0 ? void 0 : _b.cacheStats).toBeDefined();
        });
        it('should track validation time', function () {
            var schema = {
                type: 'Card',
                props: {
                    title: 'Test Card'
                }
            };
            var result = validator.validate(schema, true);
            expect(result.performance.duration).toBeGreaterThan(0);
            expect(result.performance.componentsChecked).toBe(1);
        });
    });
});
