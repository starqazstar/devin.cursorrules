const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

// 加载环境变量
dotenv.config();

// 性能监控数据
const performanceStats = {
  requestCount: 0,
  errorCount: 0,
  totalResponseTime: 0,
  slowRequestCount: 0,
  lastResetTime: Date.now()
};

// 监控配置
const monitoringConfig = {
  enabled: process.env.ENABLE_PERFORMANCE_MONITORING === 'true',
  logLevel: process.env.LOG_LEVEL || 'info',
  slowThreshold: parseInt(process.env.SLOW_REQUEST_THRESHOLD) || 1000
};

const app = express();
app.use(cors());
app.use(express.json());

// 环境变量配置
const config = {
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY,
    apiUrl: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    temperature: 0.7,
    maxTokens: 2000
  },
  server: {
    port: process.env.BACKEND_PORT || 3002,
    env: process.env.NODE_ENV || 'development'
  },
  monitoring: monitoringConfig,
  cache: {
    enabled: process.env.ENABLE_CACHE === 'true',
    ttl: parseInt(process.env.CACHE_TTL) || 3600000
  },
  security: {
    enableRateLimiting: process.env.ENABLE_RATE_LIMITING === 'true',
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 60000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  }
};

// 验证环境变量
function validateConfig() {
  const requiredVars = ['DEEPSEEK_API_KEY', 'BACKEND_PORT'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`缺少必需的环境变量: ${missingVars.join(', ')}`);
  }
}

// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error('错误:', err);
  
  const error = {
    success: false,
    error: {
      code: err.code || 'GENERATION_FAILED',
      message: err.message || '生成失败',
      details: config.server.env === 'development' ? err.stack : undefined,
      timestamp: Date.now(),
      requestId: req.requestId
    }
  };

  let statusCode = 500;
  if (err.code === 'INVALID_REQUEST') statusCode = 400;
  if (err.code === 'UNAUTHORIZED') statusCode = 401;
  if (err.code === 'NOT_FOUND') statusCode = 404;
  if (err.code === 'RATE_LIMIT_EXCEEDED') statusCode = 429;

  res.status(statusCode).json(error);
};

// 请求验证中间件
const validateRequest = (req, res, next) => {
  const { description, components } = req.body;
  
  if (!description) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_REQUEST',
        message: '页面描述不能为空',
        timestamp: Date.now(),
        requestId: req.requestId
      }
    });
  }

  if (!Array.isArray(components)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_REQUEST',
        message: '组件列表必须是数组',
        timestamp: Date.now(),
        requestId: req.requestId
      }
    });
  }

  next();
};

// 请求日志中间件
const requestLogger = (req, res, next) => {
  req.requestId = Math.random().toString(36).substr(2, 9);
  const start = Date.now();
  
  // 打印请求信息
  if (monitoringConfig.logLevel === 'debug') {
    console.log(`[${req.requestId}] ${req.method} ${req.url} - 开始处理`);
  }

  res.on('finish', () => {
    const duration = Date.now() - start;
    performanceStats.requestCount++;
    performanceStats.totalResponseTime += duration;

    if (res.statusCode >= 400) {
      performanceStats.errorCount++;
    }

    if (duration > monitoringConfig.slowThreshold) {
      performanceStats.slowRequestCount++;
      console.warn(`[${req.requestId}] ⚠️ 慢请求: ${req.method} ${req.url} - ${duration}ms`);
    }

    if (monitoringConfig.logLevel !== 'error') {
      console.log(`[${req.requestId}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
    }
  });

  next();
};

// 性能监控中间件
const performanceMonitor = (req, res, next) => {
  if (!monitoringConfig.enabled) {
    return next();
  }

  const start = process.hrtime();
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;
    
    if (duration > monitoringConfig.slowThreshold) {
      console.warn(`[${req.requestId}] ⚠️ 性能警告: ${req.method} ${req.url} - ${duration.toFixed(2)}ms`);
    }
  });
  
  next();
};

// 速率限制中间件
const rateLimiter = (() => {
  const requests = new Map();
  
  return (req, res, next) => {
    if (!config.security.enableRateLimiting) {
      return next();
    }

    const now = Date.now();
    const windowStart = now - config.security.rateLimitWindow;
    
    // 清理过期的请求记录
    requests.forEach((timestamp, ip) => {
      if (timestamp < windowStart) {
        requests.delete(ip);
      }
    });

    const clientIp = req.ip;
    const requestCount = requests.get(clientIp) || 0;

    if (requestCount >= config.security.maxRequests) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: '请求频率超出限制',
          timestamp: now,
          requestId: req.requestId
        }
      });
    }

    requests.set(clientIp, requestCount + 1);
    next();
  };
})();

// 应用中间件
app.use(requestLogger);
app.use(performanceMonitor);
app.use(rateLimiter);

// 健康检查接口
app.get('/health', (req, res) => {
  const uptime = process.uptime();
  const memory = process.memoryUsage();
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: config.server.env,
    uptime: uptime,
    memory: {
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024) + 'MB',
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024) + 'MB'
    },
    performance: {
      requestCount: performanceStats.requestCount,
      errorCount: performanceStats.errorCount,
      averageResponseTime: performanceStats.requestCount > 0 
        ? performanceStats.totalResponseTime / performanceStats.requestCount 
        : 0,
      slowRequestCount: performanceStats.slowRequestCount
    }
  });
});

// 性能统计接口
app.get('/api/stats', (req, res) => {
  res.json({
    requestCount: performanceStats.requestCount,
    errorCount: performanceStats.errorCount,
    averageResponseTime: performanceStats.requestCount > 0 
      ? performanceStats.totalResponseTime / performanceStats.requestCount 
      : 0,
    slowRequestCount: performanceStats.slowRequestCount,
    lastResetTime: new Date(performanceStats.lastResetTime).toISOString()
  });
});

// 重置统计数据接口
app.post('/api/stats/reset', (req, res) => {
  performanceStats.requestCount = 0;
  performanceStats.errorCount = 0;
  performanceStats.totalResponseTime = 0;
  performanceStats.slowRequestCount = 0;
  performanceStats.lastResetTime = Date.now();
  
  res.json({ message: '统计数据已重置' });
});

// Schema 生成接口
app.post('/api/generate', validateRequest, async (req, res, next) => {
  try {
    const { description, components } = req.body;

    console.log(`[${req.requestId}] 生成请求:`, {
      description,
      componentsCount: components.length
    });

    const startTime = Date.now();
    const response = await fetch(config.deepseek.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.deepseek.apiKey}`
      },
      body: JSON.stringify({
        model: config.deepseek.model,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的低代码平台页面生成助手，负责将用户需求转换为符合规范的页面 Schema。'
          },
          {
            role: 'user',
            content: `请根据以下描述生成页面 Schema：
描述：${description}
可用组件：${components.join(', ')}

要求：
1. 生成的 Schema 必须符合 MaterialData 接口定义
2. 只使用提供的组件列表中的组件
3. 返回的 JSON 必须是有效的页面配置
4. 确保所有必需的属性都已设置`
          }
        ],
        temperature: config.deepseek.temperature,
        max_tokens: config.deepseek.maxTokens
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API 调用失败: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const endTime = Date.now();
    
    console.log(`[${req.requestId}] API 响应:`, data);

    // 提取生成的 Schema
    let schema;
    try {
      const content = data.choices[0].message.content;
      // 移除 markdown 代码块标记
      const jsonStr = content.replace(/```json\n?|\n?```/g, '');
      schema = JSON.parse(jsonStr);
    } catch (err) {
      throw new Error('Schema 解析失败: ' + err.message);
    }

    res.json({
      success: true,
      data: schema,
      meta: {
        generationTime: endTime - startTime,
        modelUsed: config.deepseek.model,
        promptTokens: data.usage?.prompt_tokens,
        totalTokens: data.usage?.total_tokens
      }
    });
  } catch (err) {
    next(err);
  }
});

// 应用错误处理中间件
app.use(errorHandler);

// 启动服务器
try {
  validateConfig();
  app.listen(config.server.port, () => {
    console.log(`服务器运行在端口 ${config.server.port}`);
    console.log('环境配置:', {
      NODE_ENV: config.server.env,
      BACKEND_PORT: config.server.port,
      MONITORING: monitoringConfig.enabled ? '已启用' : '未启用',
      RATE_LIMITING: config.security.enableRateLimiting ? '已启用' : '未启用',
      CACHE: config.cache.enabled ? '已启用' : '未启用'
    });
  });
} catch (err) {
  console.error('服务器启动失败:', err);
  process.exit(1);
} 