var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { ErrorCode } from '../interfaces/lowcode';
import { LLMService } from './LLMService';
/**
 * 低代码服务类
 */
var LowCodeService = /** @class */ (function () {
    function LowCodeService() {
        this.deepseekModel = 'deepseek-chat';
        this.gpt4Model = 'gpt-4o-mini';
        this.requestCount = 0;
        this.totalResponseTime = 0;
        this.llmService = new LLMService();
        this.materialProtocol = {
            version: '1.0.0',
            components: [],
            categories: []
        };
        this.config = {
            apiUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002',
            timeout: parseInt(import.meta.env.VITE_REQUEST_TIMEOUT || '60000'), // 从环境变量读取超时时间，默认 60 秒
            retryCount: parseInt(import.meta.env.VITE_RETRY_COUNT || '3'),
            retryDelay: parseInt(import.meta.env.VITE_RETRY_DELAY || '1000')
        };
    }
    /**
     * 初始化物料协议
     */
    LowCodeService.prototype.initMaterialProtocol = function (protocol) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.materialProtocol = protocol;
                return [2 /*return*/];
            });
        });
    };
    /**
     * 获取平均响应时间
     */
    LowCodeService.prototype.getAverageResponseTime = function () {
        return this.requestCount > 0 ? this.totalResponseTime / this.requestCount : 0;
    };
    /**
     * 获取请求统计信息
     */
    LowCodeService.prototype.getRequestStats = function () {
        return {
            totalRequests: this.requestCount,
            averageResponseTime: this.getAverageResponseTime()
        };
    };
    /**
     * 发送请求并重试
     */
    LowCodeService.prototype.fetchWithRetry = function (url_1, options_1) {
        return __awaiter(this, arguments, void 0, function (url, options, retryCount) {
            var timeoutId, controller_1, startTime, response, endTime, error_1;
            var _this = this;
            if (retryCount === void 0) { retryCount = this.config.retryCount; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timeoutId = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 11]);
                        controller_1 = new AbortController();
                        timeoutId = setTimeout(function () {
                            controller_1.abort();
                            timeoutId = null;
                        }, this.config.timeout);
                        startTime = Date.now();
                        return [4 /*yield*/, fetch(url, __assign(__assign({}, options), { signal: controller_1.signal }))];
                    case 2:
                        response = _a.sent();
                        endTime = Date.now();
                        if (timeoutId) {
                            clearTimeout(timeoutId);
                            timeoutId = null;
                        }
                        this.requestCount++;
                        this.totalResponseTime += (endTime - startTime);
                        if (!(!response.ok && retryCount > 0)) return [3 /*break*/, 4];
                        console.warn("\u8BF7\u6C42\u5931\u8D25\uFF0C\u5C06\u5728 ".concat(this.config.retryDelay, "ms \u540E\u91CD\u8BD5\uFF0C\u5269\u4F59\u91CD\u8BD5\u6B21\u6570\uFF1A").concat(retryCount));
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, _this.config.retryDelay); })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, this.fetchWithRetry(url, options, retryCount - 1)];
                    case 4: return [2 /*return*/, response];
                    case 5:
                        error_1 = _a.sent();
                        if (timeoutId) {
                            clearTimeout(timeoutId);
                        }
                        if (!(error_1 instanceof Error && error_1.name === 'AbortError')) return [3 /*break*/, 8];
                        if (!(retryCount > 0)) return [3 /*break*/, 7];
                        console.warn("\u8BF7\u6C42\u8D85\u65F6\uFF0C\u5C06\u5728 ".concat(this.config.retryDelay, "ms \u540E\u91CD\u8BD5\uFF0C\u5269\u4F59\u91CD\u8BD5\u6B21\u6570\uFF1A").concat(retryCount));
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, _this.config.retryDelay); })];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, this.fetchWithRetry(url, options, retryCount - 1)];
                    case 7: throw new Error("\u8BF7\u6C42\u8D85\u65F6\uFF08".concat(this.config.timeout, "ms\uFF09"));
                    case 8:
                        if (!(retryCount > 0)) return [3 /*break*/, 10];
                        console.warn("\u8BF7\u6C42\u51FA\u9519\uFF0C\u5C06\u5728 ".concat(this.config.retryDelay, "ms \u540E\u91CD\u8BD5\uFF0C\u5269\u4F59\u91CD\u8BD5\u6B21\u6570\uFF1A").concat(retryCount));
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, _this.config.retryDelay); })];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, this.fetchWithRetry(url, options, retryCount - 1)];
                    case 10: throw error_1;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 获取最终的 JSON 格式 Schema
     */
    LowCodeService.prototype.getFinalSchema = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, err_1;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        console.log('发送生成请求:', request);
                        return [4 /*yield*/, this.fetchWithRetry("".concat(this.config.apiUrl, "/api/generate"), {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(request)
                            })];
                    case 1:
                        response = _d.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _d.sent();
                        console.log('API 响应:', data);
                        if (!response.ok) {
                            return [2 /*return*/, {
                                    success: false,
                                    error: {
                                        code: ((_a = data.error) === null || _a === void 0 ? void 0 : _a.code) || ErrorCode.GENERATION_FAILED,
                                        message: ((_b = data.error) === null || _b === void 0 ? void 0 : _b.message) || '生成失败',
                                        details: (_c = data.error) === null || _c === void 0 ? void 0 : _c.details
                                    }
                                }];
                        }
                        return [2 /*return*/, {
                                success: true,
                                data: data.data
                            }];
                    case 3:
                        err_1 = _d.sent();
                        console.error('请求错误:', err_1);
                        return [2 /*return*/, {
                                success: false,
                                error: {
                                    code: ErrorCode.GENERATION_FAILED,
                                    message: err_1 instanceof Error ? err_1.message : '生成失败',
                                    details: err_1
                                }
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 生成页面 Schema
     */
    LowCodeService.prototype.generatePageSchema = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var baseSchema, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.generateSchemaWithDeepSeek(request)];
                    case 1:
                        baseSchema = _a.sent();
                        if (!baseSchema) {
                            throw new Error('Schema 生成失败');
                        }
                        return [4 /*yield*/, this.optimizeGeneratedSchema(baseSchema)];
                    case 2: 
                    // 使用 DeepSeek 优化 Schema
                    return [2 /*return*/, _a.sent()];
                    case 3:
                        error_2 = _a.sent();
                        console.error('生成页面 Schema 失败:', error_2);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 使用 DeepSeek 生成基础 Schema
     */
    LowCodeService.prototype.generateSchemaWithDeepSeek = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var prompt_1, response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        prompt_1 = this.buildPrompt(request);
                        return [4 /*yield*/, this.llmService.generateSchema(prompt_1)];
                    case 1:
                        response = _a.sent();
                        if (!response.success || !response.content) {
                            throw new Error(response.error || 'Schema 生成失败');
                        }
                        return [2 /*return*/, this.parseResponse(response.content)];
                    case 2:
                        error_3 = _a.sent();
                        console.error('DeepSeek 生成 Schema 失败:', error_3);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 优化 Schema
     */
    LowCodeService.prototype.optimizeSchema = function (schema, componentName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.optimizeSchemaStructure(schema, componentName)];
            });
        });
    };
    /**
     * 验证 Schema
     */
    LowCodeService.prototype.validateSchema = function (schema, materials) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.validateSchemaWithMaterials(schema, materials)];
            });
        });
    };
    /**
     * 优化生成的 Schema
     */
    LowCodeService.prototype.optimizeGeneratedSchema = function (schema) {
        return __awaiter(this, void 0, void 0, function () {
            var response, optimizedSchema, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.llmService.optimizeSchema(JSON.stringify(schema, null, 2))];
                    case 1:
                        response = _a.sent();
                        if (!response.success || !response.content) {
                            console.warn('Schema 优化失败，使用原始 Schema');
                            return [2 /*return*/, schema];
                        }
                        optimizedSchema = this.parseResponse(response.content);
                        return [2 /*return*/, optimizedSchema || schema];
                    case 2:
                        error_4 = _a.sent();
                        console.warn('Schema 优化失败，使用原始 Schema:', error_4);
                        return [2 /*return*/, schema];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 转换为页面协议格式
     */
    LowCodeService.prototype.convertToPageProtocol = function (schema) {
        var _this = this;
        return {
            version: '1.0.0',
            title: schema.title,
            components: schema.components.map(function (comp) { return ({
                id: Math.random().toString(36).substr(2, 9),
                type: comp.type,
                props: comp.props,
                children: comp.children ? _this.convertComponents(comp.children) : undefined
            }); }),
            dataSource: schema.dataSource ? {
                list: [{
                        id: 'default',
                        type: 'static',
                        options: {
                            data: schema.dataSource.data
                        }
                    }],
                relations: []
            } : undefined
        };
    };
    /**
     * 转换组件列表
     */
    LowCodeService.prototype.convertComponents = function (components) {
        var _this = this;
        return components.map(function (comp) { return ({
            id: Math.random().toString(36).substr(2, 9),
            type: comp.type,
            props: comp.props,
            children: comp.children ? _this.convertComponents(comp.children) : undefined
        }); });
    };
    /**
     * 构建提示词
     */
    LowCodeService.prototype.buildPrompt = function (request) {
        return "\u8BF7\u6839\u636E\u4EE5\u4E0B\u9700\u6C42\u751F\u6210\u9875\u9762 Schema\u3002\n\n\u53EF\u7528\u7EC4\u4EF6\u5217\u8868\uFF1A\n".concat(JSON.stringify(request.components, null, 2), "\n\n\u793A\u4F8B 1 - \u7528\u6237\u767B\u5F55\u9875\u9762\uFF1A\n\u601D\u8003\u6B65\u9AA4\uFF1A\n1. \u5206\u6790\u9875\u9762\u7ED3\u6784\uFF1A\n   - \u9700\u8981\u4E00\u4E2A\u5C45\u4E2D\u7684\u767B\u5F55\u8868\u5355\n   - \u8868\u5355\u5305\u542B\u7528\u6237\u540D\u3001\u5BC6\u7801\u8F93\u5165\u6846\n   - \u5E95\u90E8\u9700\u8981\u767B\u5F55\u6309\u94AE\n2. \u9009\u62E9\u7EC4\u4EF6\uFF1A\n   - Form \u4F5C\u4E3A\u5BB9\u5668\n   - Input \u7528\u4E8E\u7528\u6237\u540D\u8F93\u5165\n   - Input.Password \u7528\u4E8E\u5BC6\u7801\u8F93\u5165\n   - Button \u7528\u4E8E\u63D0\u4EA4\u8868\u5355\n3. \u914D\u7F6E\u7EC4\u4EF6\u5C5E\u6027\uFF1A\n   - \u8BBE\u7F6E\u8868\u5355\u5E03\u5C40\u4E3A\u5782\u76F4\u6392\u5217\n   - \u6DFB\u52A0\u8F93\u5165\u6846\u7684\u6821\u9A8C\u89C4\u5219\n   - \u914D\u7F6E\u6309\u94AE\u7684\u6837\u5F0F\u548C\u52A0\u8F7D\u72B6\u6001\n4. \u4F18\u5316\u7528\u6237\u4F53\u9A8C\uFF1A\n   - \u6DFB\u52A0\u53CB\u597D\u7684\u6807\u7B7E\u6587\u672C\n   - \u914D\u7F6E\u9002\u5F53\u7684\u5360\u4F4D\u7B26\n   - \u8BBE\u7F6E\u5408\u7406\u7684\u7EC4\u4EF6\u95F4\u8DDD\n\n\u793A\u4F8B 2 - \u7528\u6237\u5217\u8868\u9875\u9762\uFF1A\n\u601D\u8003\u6B65\u9AA4\uFF1A\n1. \u5206\u6790\u9875\u9762\u7ED3\u6784\uFF1A\n   - \u9876\u90E8\u9700\u8981\u641C\u7D22\u533A\u57DF\n   - \u4E2D\u95F4\u662F\u7528\u6237\u5217\u8868\u8868\u683C\n   - \u53F3\u4E0A\u89D2\u9700\u8981\u6DFB\u52A0\u7528\u6237\u6309\u94AE\n2. \u9009\u62E9\u7EC4\u4EF6\uFF1A\n   - Space \u7528\u4E8E\u6574\u4F53\u5E03\u5C40\n   - Form \u7528\u4E8E\u641C\u7D22\u8868\u5355\n   - Table \u5C55\u793A\u7528\u6237\u5217\u8868\n   - Button \u7528\u4E8E\u6DFB\u52A0\u7528\u6237\n3. \u914D\u7F6E\u7EC4\u4EF6\u5C5E\u6027\uFF1A\n   - \u8BBE\u7F6E\u8868\u683C\u7684\u5217\u914D\u7F6E\n   - \u914D\u7F6E\u641C\u7D22\u8868\u5355\u7684\u5E03\u5C40\n   - \u6DFB\u52A0\u5206\u9875\u914D\u7F6E\n4. \u4F18\u5316\u7528\u6237\u4F53\u9A8C\uFF1A\n   - \u6DFB\u52A0\u6570\u636E\u52A0\u8F7D\u72B6\u6001\n   - \u914D\u7F6E\u8868\u683C\u7684\u6392\u5E8F\u548C\u7B5B\u9009\n   - \u4F18\u5316\u79FB\u52A8\u7AEF\u9002\u914D\n\n\u73B0\u5728\uFF0C\u8BF7\u6839\u636E\u4EE5\u4E0B\u9700\u6C42\uFF0C\u6309\u7167\u7C7B\u4F3C\u7684\u601D\u8003\u6B65\u9AA4\u751F\u6210\u9875\u9762 Schema\uFF1A\n\n\u9700\u6C42\u63CF\u8FF0\uFF1A\n").concat(request.description, "\n\n\u8BF7\u6309\u7167\u4EE5\u4E0B\u6B65\u9AA4\u601D\u8003\uFF1A\n1. \u5206\u6790\u9875\u9762\u7ED3\u6784\uFF1A\u786E\u5B9A\u9875\u9762\u7684\u4E3B\u8981\u533A\u57DF\u548C\u5E03\u5C40\n2. \u9009\u62E9\u5408\u9002\u7684\u7EC4\u4EF6\uFF1A\u4ECE\u53EF\u7528\u7EC4\u4EF6\u4E2D\u9009\u62E9\u6700\u9002\u5408\u7684\u7EC4\u4EF6\n3. \u914D\u7F6E\u7EC4\u4EF6\u5C5E\u6027\uFF1A\u8BBE\u7F6E\u7EC4\u4EF6\u7684\u5C5E\u6027\u3001\u9A8C\u8BC1\u89C4\u5219\u548C\u4EA4\u4E92\u884C\u4E3A\n4. \u4F18\u5316\u7528\u6237\u4F53\u9A8C\uFF1A\u6DFB\u52A0\u5FC5\u8981\u7684\u63D0\u793A\u4FE1\u606F\u548C\u5E2E\u52A9\u6587\u672C\n\n\u8981\u6C42\uFF1A\n1. \u53EA\u4F7F\u7528\u63D0\u4F9B\u7684\u53EF\u7528\u7EC4\u4EF6\n2. Schema \u5FC5\u987B\u662F\u6709\u6548\u7684 JSON \u683C\u5F0F\n3. \u7EC4\u4EF6\u5C5E\u6027\u9700\u7B26\u5408\u7EC4\u4EF6\u5B9A\u4E49\n4. \u786E\u4FDD\u751F\u6210\u7684\u9875\u9762\u529F\u80FD\u5B8C\u6574\u3001\u4F53\u9A8C\u826F\u597D\n\n\u8BF7\u76F4\u63A5\u8FD4\u56DE JSON \u683C\u5F0F\u7684 Schema\uFF0C\u5305\u542B\u4EE5\u4E0B\u5B57\u6BB5\uFF1A\n{\n  \"type\": \"page\",\n  \"title\": \"\u9875\u9762\u6807\u9898\",\n  \"components\": [\n    {\n      \"type\": \"\u7EC4\u4EF6\u7C7B\u578B\",\n      \"props\": {\n        // \u7EC4\u4EF6\u5C5E\u6027\n      },\n      \"children\": [\n        // \u5B50\u7EC4\u4EF6\n      ]\n    }\n  ],\n  \"dataSource\": {\n    \"data\": {\n      // \u9759\u6001\u6570\u636E\n    }\n  }\n}");
    };
    /**
     * 解析响应
     */
    LowCodeService.prototype.parseResponse = function (content) {
        try {
            // 移除 markdown 代码块标记
            var jsonStr = content.replace(/```json\n|\n```/g, '');
            var schema = JSON.parse(jsonStr);
            if (this.validateBasicSchema(schema)) {
                return schema;
            }
            console.error('Schema 验证失败:', schema);
            return null;
        }
        catch (error) {
            console.error('解析 Schema 失败:', error);
            return null;
        }
    };
    /**
     * 验证基础 Schema 结构
     */
    LowCodeService.prototype.validateBasicSchema = function (schema) {
        return (schema &&
            typeof schema === 'object' &&
            typeof schema.type === 'string' &&
            typeof schema.title === 'string' &&
            Array.isArray(schema.components));
    };
    /**
     * 错误处理
     */
    LowCodeService.prototype.handleError = function (error) {
        console.error('LowCode Service Error:', error);
        return {
            code: ErrorCode.GENERATION_FAILED,
            message: error.message || '生成失败',
            details: error,
            suggestions: [
                '检查物料列表是否正确',
                '确认需求描述是否清晰',
                '验证参考 Schema 格式'
            ]
        };
    };
    /**
     * 使用 DeepSeek 优化 Schema
     */
    LowCodeService.prototype.optimizeSchemaWithDeepSeek = function (schema) {
        return __awaiter(this, void 0, void 0, function () {
            var schemaStr, response, optimizedSchema, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        schemaStr = JSON.stringify(schema, null, 2);
                        return [4 /*yield*/, this.llmService.optimizeSchema(schemaStr)];
                    case 1:
                        response = _a.sent();
                        if (!response.success || !response.content) {
                            console.error('Schema 优化失败:', response.error);
                            return [2 /*return*/, schema];
                        }
                        try {
                            optimizedSchema = JSON.parse(response.content);
                            return [2 /*return*/, optimizedSchema];
                        }
                        catch (parseError) {
                            console.error('优化后的 Schema 解析失败:', parseError);
                            return [2 /*return*/, schema];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Schema 优化失败:', error_5);
                        return [2 /*return*/, schema];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 验证 Schema 结构和类型
     */
    LowCodeService.prototype.validateSchemaStructure = function (schema) {
        if (!schema || typeof schema !== 'object') {
            return false;
        }
        // 基本属性验证
        if (!schema.version || typeof schema.version !== 'string') {
            return false;
        }
        if (!schema.components || !Array.isArray(schema.components)) {
            return false;
        }
        return true;
    };
    /**
     * 验证 Schema 与物料的兼容性
     */
    LowCodeService.prototype.validateSchemaWithMaterials = function (schema, materials) {
        return __awaiter(this, void 0, void 0, function () {
            var materialSet, validateComponent, validateComponents;
            return __generator(this, function (_a) {
                // 验证 schema 结构
                if (!this.validateSchemaStructure(schema)) {
                    throw new Error('Invalid schema structure');
                }
                materialSet = new Set(materials);
                validateComponent = function (component) {
                    if (!component || !component.type) {
                        return false;
                    }
                    return materialSet.has(component.type);
                };
                validateComponents = function (components) {
                    return components.every(function (component) {
                        var isValid = validateComponent(component);
                        if (component.children) {
                            return isValid && validateComponents(component.children);
                        }
                        return isValid;
                    });
                };
                if (!validateComponents(schema.components)) {
                    throw new Error('Schema contains incompatible components');
                }
                return [2 /*return*/, schema];
            });
        });
    };
    /**
     * 优化 Schema 的组件结构和属性
     */
    LowCodeService.prototype.optimizeSchemaStructure = function (schema, componentName) {
        return __awaiter(this, void 0, void 0, function () {
            var schemaWithContext, schemaStr, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // 验证 schema 结构
                        if (!this.validateSchemaStructure(schema)) {
                            throw new Error('Invalid schema structure');
                        }
                        schemaWithContext = __assign(__assign({}, schema), { componentContext: {
                                name: componentName,
                                protocol: this.materialProtocol
                            } });
                        schemaStr = JSON.stringify(schemaWithContext, null, 2);
                        return [4 /*yield*/, this.llmService.optimizeSchema(schemaStr)];
                    case 1:
                        response = _a.sent();
                        if (!response.success || !response.content) {
                            throw new Error(response.error || 'Schema optimization failed');
                        }
                        try {
                            return [2 /*return*/, JSON.parse(response.content)];
                        }
                        catch (error) {
                            throw new Error('Failed to parse optimized schema');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return LowCodeService;
}());
export { LowCodeService };
