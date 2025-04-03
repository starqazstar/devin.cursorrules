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
// LLM API 配置
var API_CONFIG = {
    GENERATE_API_URL: 'http://localhost:3002/api/llm/generate',
    OPTIMIZE_API_URL: 'http://localhost:3002/api/llm/optimize'
};
/**
 * LLM 服务类
 */
var LLMService = /** @class */ (function () {
    function LLMService() {
    }
    /**
     * 生成 Schema
     */
    LLMService.prototype.generateSchema = function (prompt) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('Generating schema with prompt:', prompt);
                return [2 /*return*/, this.callLLM(prompt, API_CONFIG.GENERATE_API_URL)];
            });
        });
    };
    /**
     * 优化 Schema
     */
    LLMService.prototype.optimizeSchema = function (schema) {
        return __awaiter(this, void 0, void 0, function () {
            var optimizePrompt;
            return __generator(this, function (_a) {
                optimizePrompt = "\u8BF7\u4F18\u5316\u4EE5\u4E0B\u9875\u9762 Schema\uFF0C\u786E\u4FDD\uFF1A\n1. \u5E03\u5C40\u5408\u7406\uFF0C\u7B26\u5408\u7528\u6237\u4E60\u60EF\n2. \u7EC4\u4EF6\u5C5E\u6027\u914D\u7F6E\u5B8C\u6574\n3. \u8868\u5355\u9A8C\u8BC1\u89C4\u5219\u5408\u9002\n4. \u6570\u636E\u7ED3\u6784\u6E05\u6670\n5. \u5FC5\u8981\u65F6\u6DFB\u52A0\u8F85\u52A9\u7EC4\u4EF6\uFF08\u5982\u63D0\u793A\u3001\u5E2E\u52A9\u6587\u672C\u7B49\uFF09\n\nSchema:\n".concat(schema);
                console.log('Optimizing schema with prompt:', optimizePrompt);
                return [2 /*return*/, this.callLLM(optimizePrompt, API_CONFIG.OPTIMIZE_API_URL)];
            });
        });
    };
    /**
     * 调用 LLM API
     */
    LLMService.prototype.callLLM = function (prompt, apiUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        console.log("Making request to ".concat(apiUrl));
                        return [4 /*yield*/, fetch(apiUrl, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ prompt: prompt })
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("HTTP error! status: ".concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        console.log('LLM response:', data);
                        return [2 /*return*/, data];
                    case 3:
                        error_1 = _a.sent();
                        console.error('LLM API error:', error_1);
                        return [2 /*return*/, {
                                success: false,
                                error: error_1 instanceof Error ? error_1.message : '未知错误'
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return LLMService;
}());
export { LLMService };
