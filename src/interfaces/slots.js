var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// 插槽验证器类
var SlotValidator = /** @class */ (function () {
    function SlotValidator(registry) {
        this.registry = registry;
    }
    // 验证组件的插槽
    SlotValidator.prototype.validateComponentSlots = function (componentName, slots, path) {
        if (path === void 0) { path = []; }
        var errors = [];
        var componentSlots = this.registry[componentName];
        if (!componentSlots) {
            return [{
                    componentName: componentName,
                    slotName: '',
                    message: "Component \"".concat(componentName, "\" not found in slots registry"),
                    path: path
                }];
        }
        // 检查必需的插槽
        for (var _i = 0, _a = Object.entries(componentSlots); _i < _a.length; _i++) {
            var _b = _a[_i], slotName = _b[0], slotDef = _b[1];
            if (slotDef.required && !slots[slotName]) {
                errors.push({
                    componentName: componentName,
                    slotName: slotName,
                    message: "Required slot \"".concat(slotName, "\" is missing"),
                    path: __spreadArray(__spreadArray([], path, true), [slotName], false)
                });
            }
        }
        // 检查提供的插槽是否有效
        for (var _c = 0, _d = Object.entries(slots); _c < _d.length; _c++) {
            var _e = _d[_c], slotName = _e[0], slotValue = _e[1];
            var slotDef = componentSlots[slotName];
            if (!slotDef) {
                errors.push({
                    componentName: componentName,
                    slotName: slotName,
                    message: "Unknown slot \"".concat(slotName, "\""),
                    path: __spreadArray(__spreadArray([], path, true), [slotName], false)
                });
                continue;
            }
            // 验证插槽值
            if (slotDef.validation) {
                var validationErrors = this.validateSlotValue(slotValue, slotDef.validation, __spreadArray(__spreadArray([], path, true), [slotName], false));
                errors.push.apply(errors, validationErrors);
            }
        }
        return errors;
    };
    // 验证插槽值
    SlotValidator.prototype.validateSlotValue = function (value, validation, path) {
        var errors = [];
        // 类型检查
        if (!this.checkType(value, validation.type)) {
            errors.push({
                componentName: path[0],
                slotName: path[path.length - 1],
                message: "Invalid type: expected \"".concat(validation.type, "\""),
                path: path
            });
        }
        // 应用验证规则
        for (var _i = 0, _a = validation.rules; _i < _a.length; _i++) {
            var rule = _a[_i];
            var error = this.applyValidationRule(value, rule, path);
            if (error) {
                errors.push(error);
            }
        }
        return errors;
    };
    // 检查值的类型
    SlotValidator.prototype.checkType = function (value, expectedType) {
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
    };
    // 应用验证规则
    SlotValidator.prototype.applyValidationRule = function (value, rule, path) {
        // 根据规则类型进行验证
        switch (rule.type) {
            case 'required':
                if (value === undefined || value === null || value === '') {
                    return {
                        componentName: path[0],
                        slotName: path[path.length - 1],
                        message: 'Value is required',
                        path: path
                    };
                }
                break;
            case 'min':
                if (typeof value === 'number' && value < rule.value) {
                    return {
                        componentName: path[0],
                        slotName: path[path.length - 1],
                        message: "Value must be greater than or equal to ".concat(rule.value),
                        path: path
                    };
                }
                break;
            case 'max':
                if (typeof value === 'number' && value > rule.value) {
                    return {
                        componentName: path[0],
                        slotName: path[path.length - 1],
                        message: "Value must be less than or equal to ".concat(rule.value),
                        path: path
                    };
                }
                break;
            case 'pattern':
                if (typeof value === 'string' && !new RegExp(rule.value).test(value)) {
                    return {
                        componentName: path[0],
                        slotName: path[path.length - 1],
                        message: 'Value does not match pattern',
                        path: path
                    };
                }
                break;
        }
        return null;
    };
    return SlotValidator;
}());
export { SlotValidator };
// 默认导出 SlotValidator 类
export default SlotValidator;
