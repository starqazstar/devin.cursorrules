import { ComponentSchema, JSSlot } from '../interfaces/slots';
import { ComponentRegistry } from '../constants/slots';
import { performance } from 'perf_hooks';
import debug from 'debug';

// 创建调试记录器
const log = debug('validator:runtime');
const logPerf = debug('validator:performance');
const logCache = debug('validator:cache');

interface ValidationError {
  path: string[];
  message: string;
  component: string;
  suggestions?: string[];
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  performance: {
    duration: number;
    componentsChecked: number;
  };
  debug?: {
    validationTrace: ValidationTrace[];
    cacheStats: {
      hits: number;
      misses: number;
      size: number;
    };
  };
}

interface ValidationTrace {
  component: string;
  path: string[];
  duration: number;
  childrenCount: number;
  errors: ValidationError[];
}

interface ValidationContext {
  path: string[];
  cache: Map<string, ValidationResult>;
  startTime: number;
  componentsChecked: number;
  trace: ValidationTrace[];
  isDebugEnabled: boolean;
}

export class RuntimeValidator {
  private static instance: RuntimeValidator;
  private cache: Map<string, ValidationResult>;

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): RuntimeValidator {
    if (!RuntimeValidator.instance) {
      RuntimeValidator.instance = new RuntimeValidator();
    }
    return RuntimeValidator.instance;
  }

  /**
   * 验证组件树
   * @param schema 组件 Schema
   * @param enableDebug 是否启用调试
   * @returns 验证结果
   */
  public validate(schema: ComponentSchema, enableDebug = false): ValidationResult {
    const startTime = performance.now();
    
    // 检查缓存
    const cacheKey = this.generateCacheKey(schema);
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      logCache('Cache hit for %s', cacheKey);
      this._cacheHits++;
      return cachedResult;
    }
    logCache('Cache miss for %s', cacheKey);
    this._cacheMisses++;

    const context: ValidationContext = {
      path: [],
      cache: this.cache,
      startTime,
      componentsChecked: 0,
      trace: [],
      isDebugEnabled: enableDebug
    };

    log('Starting validation for schema type: %s', schema.type);
    const errors = this.validateComponent(schema, context);
    const duration = performance.now() - startTime;

    const result: ValidationResult = {
      isValid: errors.length === 0,
      errors,
      performance: {
        duration,
        componentsChecked: context.componentsChecked
      }
    };

    if (enableDebug) {
      result.debug = {
        validationTrace: context.trace,
        cacheStats: {
          hits: this._cacheHits,
          misses: this._cacheMisses,
          size: this.cache.size
        }
      };
    }

    logPerf(
      'Validation completed in %dms, checked %d components',
      duration,
      context.componentsChecked
    );

    // 缓存结果
    this.cache.set(cacheKey, result);
    if (this.cache.size > 1000) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
      logCache('Cache size limit reached, removed oldest entry');
    }

    return result;
  }

  /**
   * 生成缓存键
   * @param schema 组件 Schema
   * @returns 缓存键
   */
  private generateCacheKey(schema: ComponentSchema): string {
    return JSON.stringify({
      type: schema.type,
      props: schema.props || {},
      children: schema.children || [],
      id: schema.id || ''
    });
  }

  /**
   * 获取验证器性能统计
   * @returns 性能统计信息
   */
  public getPerformanceStats(): {
    cacheSize: number;
    cacheHits: number;
    cacheMisses: number;
    averageValidationTime: number;
  } {
    const stats = {
      cacheSize: this.cache.size,
      cacheHits: this._cacheHits,
      cacheMisses: this._cacheMisses,
      averageValidationTime: this._totalValidationTime / (this._cacheHits + this._cacheMisses)
    };
    return stats;
  }

  private _cacheHits = 0;
  private _cacheMisses = 0;
  private _totalValidationTime = 0;

  /**
   * 重置性能统计
   */
  public resetPerformanceStats(): void {
    this._cacheHits = 0;
    this._cacheMisses = 0;
    this._totalValidationTime = 0;
  }

  /**
   * 验证单个组件
   * @param component 组件
   * @param context 验证上下文
   * @returns 验证错误列表
   */
  private validateComponent(
    component: ComponentSchema,
    context: ValidationContext
  ): ValidationError[] {
    const componentStartTime = performance.now();
    context.componentsChecked++;
    const errors: ValidationError[] = [];

    log('Validating component %s at path %s', component.type, context.path.join('.'));

    // 1. 检查组件是否在注册表中
    if (!ComponentRegistry[component.type]) {
      const error = {
        path: [...context.path],
        message: `未知的组件类型: ${component.type}`,
        component: component.type,
        suggestions: this.getSuggestions(component.type)
      };
      errors.push(error);
      log('Component type error: %O', error);
      return errors;
    }

    // 2. 验证插槽
    if (component.type === 'JSSlot') {
      const slotErrors = this.validateSlot(component as JSSlot, context);
      errors.push(...slotErrors);
      if (slotErrors.length > 0) {
        log('Slot validation errors: %O', slotErrors);
      }
    }

    // 3. 递归验证子组件
    const childrenCount = component.children?.length || 0;
    if (component.children) {
      component.children.forEach((child, index) => {
        context.path.push(`children[${index}]`);
        const childErrors = this.validateComponent(child, context);
        errors.push(...childErrors);
        context.path.pop();
      });
    }

    // 4. 验证组件属性
    const propErrors = this.validateProps(component, context);
    errors.push(...propErrors);
    if (propErrors.length > 0) {
      log('Property validation errors: %O', propErrors);
    }

    // 记录验证追踪
    if (context.isDebugEnabled) {
      context.trace.push({
        component: component.type,
        path: [...context.path],
        duration: performance.now() - componentStartTime,
        childrenCount,
        errors: [...errors]
      });
    }

    return errors;
  }

  /**
   * 验证插槽
   * @param slot 插槽组件
   * @param context 验证上下文
   * @returns 验证错误列表
   */
  private validateSlot(
    slot: JSSlot,
    context: ValidationContext
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // 检查插槽名称
    if (!slot.name) {
      errors.push({
        path: [...context.path],
        message: '插槽必须指定名称',
        component: 'JSSlot'
      });
    }

    // 检查插槽内容
    if (!slot.children || slot.children.length === 0) {
      errors.push({
        path: [...context.path],
        message: '插槽不能为空',
        component: 'JSSlot'
      });
    }

    return errors;
  }

  /**
   * 验证组件属性
   * @param component 组件
   * @param context 验证上下文
   * @returns 验证错误列表
   */
  private validateProps(
    component: ComponentSchema,
    context: ValidationContext
  ): ValidationError[] {
    const errors: ValidationError[] = [];
    const componentDef = ComponentRegistry[component.type];

    if (!componentDef) {
      return errors;
    }

    // 检查必需属性
    componentDef.requiredProps?.forEach(prop => {
      if (!component.props || !(prop in component.props)) {
        errors.push({
          path: [...context.path],
          message: `缺少必需属性: ${prop}`,
          component: component.type
        });
      }
    });

    // 检查属性类型
    if (component.props) {
      Object.entries(component.props).forEach(([key, value]) => {
        const propDef = componentDef.props?.[key];
        if (!propDef) {
          errors.push({
            path: [...context.path, `props.${key}`],
            message: `未知的属性: ${key}`,
            component: component.type,
            suggestions: this.getSimilarProps(key, componentDef.props || {})
          });
          return;
        }

        if (!this.validatePropType(value, propDef.type)) {
          errors.push({
            path: [...context.path, `props.${key}`],
            message: `属性类型错误: ${key} 应为 ${propDef.type}`,
            component: component.type
          });
        }
      });
    }

    return errors;
  }

  /**
   * 验证属性类型
   * @param value 属性值
   * @param type 期望类型
   * @returns 是否类型匹配
   */
  private validatePropType(value: any, type: string): boolean {
    switch (type) {
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
        return true;
    }
  }

  /**
   * 获取相似组件建议
   * @param type 未知的组件类型
   * @returns 建议列表
   */
  private getSuggestions(type: string): string[] {
    const registeredTypes = Object.keys(ComponentRegistry);
    return registeredTypes
      .filter(t => this.calculateSimilarity(type, t) > 0.6)
      .slice(0, 3);
  }

  /**
   * 获取相似属性建议
   * @param prop 未知的属性名
   * @param props 已知的属性集合
   * @returns 建议列表
   */
  private getSimilarProps(prop: string, props: Record<string, any>): string[] {
    return Object.keys(props)
      .filter(p => this.calculateSimilarity(prop, p) > 0.6)
      .slice(0, 3);
  }

  /**
   * 计算字符串相似度（Levenshtein 距离）
   * @param str1 字符串1
   * @param str2 字符串2
   * @returns 相似度（0-1）
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const track = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j;
    }
    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1,
          track[j - 1][i] + 1,
          track[j - 1][i - 1] + indicator
        );
      }
    }
    return 1 - track[str2.length][str1.length] / Math.max(str1.length, str2.length);
  }

  /**
   * 清除缓存
   */
  public clearCache(): void {
    this.cache.clear();
  }
} 