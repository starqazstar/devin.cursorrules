# API 文档

## 概述

本文档描述了低代码平台的 API 接口规范。所有接口都遵循 RESTful 设计原则，使用 JSON 格式进行数据交换。

## 基础信息

- 基础 URL: `http://localhost:3002`
- API 版本: v1
- 内容类型: `application/json`

## 认证

所有 API 请求都需要在 Header 中包含 API 密钥：

```http
X-API-Key: your_api_key_here
```

## 错误处理

所有错误响应都遵循以下格式：

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误信息",
    "details": {},
    "suggestions": [],
    "timestamp": 1234567890,
    "requestId": "req_123"
  }
}
```

### 错误码说明

| 错误码 | 说明 | HTTP 状态码 |
|--------|------|------------|
| INVALID_SCHEMA | Schema 格式错误 | 400 |
| UNKNOWN_COMPONENT | 未知组件 | 400 |
| INVALID_PROPS | 属性错误 | 400 |
| GENERATION_FAILED | 生成失败 | 500 |
| INVALID_REQUEST | 请求参数错误 | 400 |
| UNAUTHORIZED | 未授权 | 401 |
| NOT_FOUND | 资源未找到 | 404 |
| RATE_LIMIT_EXCEEDED | 超出请求限制 | 429 |

## 接口列表

### 1. 生成页面 Schema

生成页面的 JSON Schema 配置。

- 请求方法: `POST`
- 路径: `/api/generate`
- 请求体:

```json
{
  "description": "页面功能描述",
  "components": ["组件1", "组件2"],
  "options": {
    "template": "模板名称",
    "theme": "主题配置",
    "i18n": true
  }
}
```

- 响应:

```json
{
  "success": true,
  "data": {
    "type": "page",
    "title": "页面标题",
    "components": []
  },
  "meta": {
    "generationTime": 1234,
    "modelUsed": "deepseek-chat",
    "promptTokens": 100,
    "totalTokens": 200
  }
}
```

### 2. 获取性能统计

获取系统性能统计数据。

- 请求方法: `GET`
- 路径: `/api/stats`
- 响应:

```json
{
  "requestCount": 100,
  "errorCount": 5,
  "averageResponseTime": 200,
  "slowRequestCount": 2,
  "lastResetTime": "2024-03-20T12:00:00Z"
}
```

### 3. 重置统计数据

重置性能统计数据。

- 请求方法: `POST`
- 路径: `/api/stats/reset`
- 响应:

```json
{
  "message": "统计数据已重置"
}
```

### 4. 健康检查

检查服务健康状态。

- 请求方法: `GET`
- 路径: `/health`
- 响应:

```json
{
  "status": "ok",
  "timestamp": "2024-03-20T12:00:00Z",
  "env": "development",
  "uptime": 1234,
  "memory": {
    "heapUsed": "50MB",
    "heapTotal": "100MB"
  },
  "performance": {
    "requestCount": 100,
    "errorCount": 5,
    "averageResponseTime": 200,
    "slowRequestCount": 2
  }
}
```

## 速率限制

API 实施了以下速率限制：

- 时间窗口: 60 秒
- 最大请求数: 100
- 超出限制时返回 429 状态码

## 缓存策略

- 启用缓存: 是
- 缓存时间: 3600 秒
- 最大缓存数: 1000 条

## 安全说明

1. 所有请求都必须包含有效的 API 密钥
2. 生产环境必须使用 HTTPS
3. 请求大小限制：100KB
4. 请求头大小限制：8KB

## 性能建议

1. 使用适当的缓存策略
2. 避免频繁的重复请求
3. 合理设置超时时间
4. 实现请求重试机制 