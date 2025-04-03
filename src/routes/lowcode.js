var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Router } from 'express';
import { validateSlots } from '../middleware/slotValidator';
import { LowCodeService } from '../services/LowCodeService';
import { ErrorCode } from '../interfaces/lowcode';
var router = Router();
var lowCodeService = new LowCodeService();
// 生成页面 Schema
router.post('/generate', validateSlots, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, description, components, result, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, description = _a.description, components = _a.components;
                if (!description || !components) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: {
                                code: ErrorCode.INVALID_REQUEST,
                                message: '缺少必要参数',
                                timestamp: Date.now(),
                                requestId: req.requestId
                            }
                        })];
                }
                return [4 /*yield*/, lowCodeService.generatePageSchema({
                        description: description,
                        components: components
                    })];
            case 1:
                result = _b.sent();
                res.json({
                    success: true,
                    data: result
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error("[".concat(req.requestId, "] \u751F\u6210\u9875\u9762 Schema \u5931\u8D25:"), error_1);
                res.status(500).json({
                    success: false,
                    error: {
                        code: ErrorCode.GENERATION_FAILED,
                        message: error_1 instanceof Error ? error_1.message : '生成页面 Schema 失败',
                        timestamp: Date.now(),
                        requestId: req.requestId
                    }
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// 优化页面 Schema
router.post('/optimize', validateSlots, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, schema, componentName, result, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, schema = _a.schema, componentName = _a.componentName;
                if (!schema || !componentName) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: {
                                code: ErrorCode.INVALID_REQUEST,
                                message: '缺少必要参数',
                                timestamp: Date.now(),
                                requestId: req.requestId
                            }
                        })];
                }
                return [4 /*yield*/, lowCodeService.optimizeSchema(schema, componentName)];
            case 1:
                result = _b.sent();
                res.json({
                    success: true,
                    data: result
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error("[".concat(req.requestId, "] \u4F18\u5316\u9875\u9762 Schema \u5931\u8D25:"), error_2);
                res.status(500).json({
                    success: false,
                    error: {
                        code: ErrorCode.GENERATION_FAILED,
                        message: error_2 instanceof Error ? error_2.message : '优化页面 Schema 失败',
                        timestamp: Date.now(),
                        requestId: req.requestId
                    }
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// 验证页面 Schema
router.post('/validate', validateSlots, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, schema, materials, result, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, schema = _a.schema, materials = _a.materials;
                if (!schema || !materials) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: {
                                code: ErrorCode.INVALID_REQUEST,
                                message: '缺少必要参数',
                                timestamp: Date.now(),
                                requestId: req.requestId
                            }
                        })];
                }
                return [4 /*yield*/, lowCodeService.validateSchema(schema, materials)];
            case 1:
                result = _b.sent();
                res.json({
                    success: true,
                    data: result
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error("[".concat(req.requestId, "] \u9A8C\u8BC1\u9875\u9762 Schema \u5931\u8D25:"), error_3);
                res.status(500).json({
                    success: false,
                    error: {
                        code: ErrorCode.VALIDATION_ERROR,
                        message: error_3 instanceof Error ? error_3.message : '验证页面 Schema 失败',
                        timestamp: Date.now(),
                        requestId: req.requestId
                    }
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
export default router;
