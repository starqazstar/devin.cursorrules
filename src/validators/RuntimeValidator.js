var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { ComponentRegistry } from '../constants/slots';
import { performance } from 'perf_hooks';
import debug from 'debug';
// 创建调试记录器
var log = debug('validator:runtime');
var logPerf = debug('validator:performance');
var logCache = debug('validator:cache');
var RuntimeValidator = /** @class */ (function () {
    function RuntimeValidator() {
        this._cacheHits = 0;
        this._cacheMisses = 0;
        this._totalValidationTime = 0;
        this.cache = new Map();
    }
    RuntimeValidator.getInstance = function () {
        if (!RuntimeValidator.instance) {
            RuntimeValidator.instance = new RuntimeValidator();
        }
        return RuntimeValidator.instance;
    };
    /**
     * 验证组件树
     * @param schema 组件 Schema
     * @param enableDebug 是否启用调试
     * @returns 验证结果
     */
    RuntimeValidator.prototype.validate = function (schema, enableDebug) {
        if (enableDebug === void 0) { enableDebug = false; }
        var startTime = performance.now();
        // 检查缓存
        var cacheKey = this.generateCacheKey(schema);
        var cachedResult = this.cache.get(cacheKey);
        if (cachedResult) {
            logCache('Cache hit for %s', cacheKey);
            this._cacheHits++;
            return cachedResult;
        }
        logCache('Cache miss for %s', cacheKey);
        this._cacheMisses++;
        var context = {
            path: [],
            cache: this.cache,
            startTime: startTime,
            componentsChecked: 0,
            trace: [],
            isDebugEnabled: enableDebug
        };
        log('Starting validation for schema type: %s', schema.type);
        var errors = this.validateComponent(schema, context);
        var duration = performance.now() - startTime;
        var result = {
            isValid: errors.length === 0,
            errors: errors,
            performance: {
                duration: duration,
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
        logPerf('Validation completed in %dms, checked %d components', duration, context.componentsChecked);
        // 缓存结果
        this.cache.set(cacheKey, result);
        if (this.cache.size > 1000) {
            var firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
            logCache('Cache size limit reached, removed oldest entry');
        }
        return result;
    };
    /**
     * 生成缓存键
     * @param schema 组件 Schema
     * @returns 缓存键
     */
    RuntimeValidator.prototype.generateCacheKey = function (schema) {
        return JSON.stringify({
            type: schema.type,
            props: schema.props || {},
            children: schema.children || [],
            id: schema.id || ''
        });
    };
    /**
     * 获取验证器性能统计
     * @returns 性能统计信息
     */
    RuntimeValidator.prototype.getPerformanceStats = function () {
        var stats = {
            cacheSize: this.cache.size,
            cacheHits: this._cacheHits,
            cacheMisses: this._cacheMisses,
            averageValidationTime: this._totalValidationTime / (this._cacheHits + this._cacheMisses)
        };
        return stats;
    };
    /**
     * 重置性能统计
     */
    RuntimeValidator.prototype.resetPerformanceStats = function () {
        this._cacheHits = 0;
        this._cacheMisses = 0;
        this._totalValidationTime = 0;
    };
    /**
     * 验证单个组件
     * @param component 组件
     * @param context 验证上下文
     * @returns 验证错误列表
     */
    RuntimeValidator.prototype.validateComponent = function (component, context) {
        var _this = this;
        var _a;
        var componentStartTime = performance.now();
        context.componentsChecked++;
        var errors = [];
        log('Validating component %s at path %s', component.type, context.path.join('.'));
        // 1. 检查组件是否在注册表中
        if (!ComponentRegistry[component.type]) {
            var error = {
                path: __spreadArray([], context.path, true),
                message: "\u672A\u77E5\u7684\u7EC4\u4EF6\u7C7B\u578B: ".concat(component.type),
                component: component.type,
                suggestions: this.getSuggestions(component.type)
            };
            errors.push(error);
            log('Component type error: %O', error);
            return errors;
        }
        // 2. 验证插槽
        if (component.type === 'JSSlot') {
            var slotErrors = this.validateSlot(component, context);
            errors.push.apply(errors, slotErrors);
            if (slotErrors.length > 0) {
                log('Slot validation errors: %O', slotErrors);
            }
        }
        // 3. 递归验证子组件
        var childrenCount = ((_a = component.children) === null || _a === void 0 ? void 0 : _a.length) || 0;
        if (component.children) {
            component.children.forEach(function (child, index) {
                context.path.push("children[".concat(index, "]"));
                var childErrors = _this.validateComponent(child, context);
                errors.push.apply(errors, childErrors);
                context.path.pop();
            });
        }
        // 4. 验证组件属性
        var propErrors = this.validateProps(component, context);
        errors.push.apply(errors, propErrors);
        if (propErrors.length > 0) {
            log('Property validation errors: %O', propErrors);
        }
        // 记录验证追踪
        if (context.isDebugEnabled) {
            context.trace.push({
                component: component.type,
                path: __spreadArray([], context.path, true),
                duration: performance.now() - componentStartTime,
                childrenCount: childrenCount,
                errors: __spreadArray([], errors, true)
            });
        }
        return errors;
    };
    /**
     * 验证插槽
     * @param slot 插槽组件
     * @param context 验证上下文
     * @returns 验证错误列表
     */
    RuntimeValidator.prototype.validateSlot = function (slot, context) {
        var errors = [];
        // 检查插槽名称
        if (!slot.name) {
            errors.push({
                path: __spreadArray([], context.path, true),
                message: '插槽必须指定名称',
                component: 'JSSlot'
            });
        }
        // 检查插槽内容
        if (!slot.children || slot.children.length === 0) {
            errors.push({
                path: __spreadArray([], context.path, true),
                message: '插槽不能为空',
                component: 'JSSlot'
            });
        }
        return errors;
    };
    /**
     * 验证组件属性
     * @param component 组件
     * @param context 验证上下文
     * @returns 验证错误列表
     */
    RuntimeValidator.prototype.validateProps = function (component, context) {
        var _this = this;
        var _a;
        var errors = [];
        var componentDef = ComponentRegistry[component.type];
        if (!componentDef) {
            return errors;
        }
        // 检查必需属性
        (_a = componentDef.requiredProps) === null || _a === void 0 ? void 0 : _a.forEach(function (prop) {
            if (!component.props || !(prop in component.props)) {
                errors.push({
                    path: __spreadArray([], context.path, true),
                    message: "\u7F3A\u5C11\u5FC5\u9700\u5C5E\u6027: ".concat(prop),
                    component: component.type
                });
            }
        });
        // 检查属性类型
        if (component.props) {
            Object.entries(component.props).forEach(function (_a) {
                var _b;
                var key = _a[0], value = _a[1];
                var propDef = (_b = componentDef.props) === null || _b === void 0 ? void 0 : _b[key];
                if (!propDef) {
                    errors.push({
                        path: __spreadArray(__spreadArray([], context.path, true), ["props.".concat(key)], false),
                        message: "\u672A\u77E5\u7684\u5C5E\u6027: ".concat(key),
                        component: component.type,
                        suggestions: _this.getSimilarProps(key, componentDef.props || {})
                    });
                    return;
                }
                if (!_this.validatePropType(value, propDef.type)) {
                    errors.push({
                        path: __spreadArray(__spreadArray([], context.path, true), ["props.".concat(key)], false),
                        message: "\u5C5E\u6027\u7C7B\u578B\u9519\u8BEF: ".concat(key, " \u5E94\u4E3A ").concat(propDef.type),
                        component: component.type
                    });
                }
            });
        }
        return errors;
    };
    /**
     * 验证属性类型
     * @param value 属性值
     * @param type 期望类型
     * @returns 是否类型匹配
     */
    RuntimeValidator.prototype.validatePropType = function (value, type) {
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
    };
    /**
     * 获取相似组件建议
     * @param type 未知的组件类型
     * @returns 建议列表
     */
    RuntimeValidator.prototype.getSuggestions = function (type) {
        var _this = this;
        var registeredTypes = Object.keys(ComponentRegistry);
        return registeredTypes
            .filter(function (t) { return _this.calculateSimilarity(type, t) > 0.6; })
            .slice(0, 3);
    };
    /**
     * 获取相似属性建议
     * @param prop 未知的属性名
     * @param props 已知的属性集合
     * @returns 建议列表
     */
    RuntimeValidator.prototype.getSimilarProps = function (prop, props) {
        var _this = this;
        return Object.keys(props)
            .filter(function (p) { return _this.calculateSimilarity(prop, p) > 0.6; })
            .slice(0, 3);
    };
    /**
     * 计算字符串相似度（Levenshtein 距离）
     * @param str1 字符串1
     * @param str2 字符串2
     * @returns 相似度（0-1）
     */
    RuntimeValidator.prototype.calculateSimilarity = function (str1, str2) {
        var track = Array(str2.length + 1).fill(null).map(function () {
            return Array(str1.length + 1).fill(null);
        });
        for (var i = 0; i <= str1.length; i += 1) {
            track[0][i] = i;
        }
        for (var j = 0; j <= str2.length; j += 1) {
            track[j][0] = j;
        }
        for (var j = 1; j <= str2.length; j += 1) {
            for (var i = 1; i <= str1.length; i += 1) {
                var indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                track[j][i] = Math.min(track[j][i - 1] + 1, track[j - 1][i] + 1, track[j - 1][i - 1] + indicator);
            }
        }
        return 1 - track[str2.length][str1.length] / Math.max(str1.length, str2.length);
    };
    /**
     * 清除缓存
     */
    RuntimeValidator.prototype.clearCache = function () {
        this.cache.clear();
    };
    return RuntimeValidator;
}());
export { RuntimeValidator };
