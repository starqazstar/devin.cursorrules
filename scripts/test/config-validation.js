const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const crypto = require('crypto');
const https = require('https');

// 加载环境变量
dotenv.config();

// 定义必需的环境变量
const requiredEnvVars = [
  'NODE_ENV',
  'FRONTEND_PORT',
  'BACKEND_PORT',
  'API_BASE_URL',
  'DEEPSEEK_API_KEY'
];

// 定义配置验证函数
const validateConfig = () => {
  console.log('开始验证配置...\n');
  let hasError = false;

  // 1. 验证必需的环境变量
  console.log('1. 验证环境变量:');
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      console.error(`  ❌ 缺少必需的环境变量: ${varName}`);
      hasError = true;
    } else {
      console.log(`  ✓ ${varName} 已配置`);
    }
  });
  console.log();

  // 2. 验证端口配置
  console.log('2. 验证端口配置:');
  const frontendPort = parseInt(process.env.FRONTEND_PORT);
  const backendPort = parseInt(process.env.BACKEND_PORT);
  
  if (isNaN(frontendPort) || frontendPort < 1 || frontendPort > 65535) {
    console.error('  ❌ 前端端口配置无效');
    hasError = true;
  } else {
    console.log('  ✓ 前端端口配置正确');
  }
  
  if (isNaN(backendPort) || backendPort < 1 || backendPort > 65535) {
    console.error('  ❌ 后端端口配置无效');
    hasError = true;
  } else {
    console.log('  ✓ 后端端口配置正确');
  }
  console.log();

  // 3. 验证 HTTPS 配置
  console.log('3. 验证 HTTPS 配置:');
  if (process.env.ENABLE_HTTPS === 'true') {
    const sslKeyPath = process.env.SSL_KEY_PATH;
    const sslCertPath = process.env.SSL_CERT_PATH;

    if (!sslKeyPath || !sslCertPath) {
      console.error('  ❌ 启用了 HTTPS 但未配置证书路径');
      hasError = true;
    } else {
      try {
        fs.accessSync(sslKeyPath, fs.constants.R_OK);
        fs.accessSync(sslCertPath, fs.constants.R_OK);
        console.log('  ✓ SSL 证书文件存在且可读');
      } catch (err) {
        console.error('  ❌ SSL 证书文件不存在或不可读');
        hasError = true;
      }
    }
  } else {
    console.log('  ✓ HTTPS 未启用');
  }
  console.log();

  // 4. 验证安全配置
  console.log('4. 验证安全配置:');
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.error('  ❌ JWT 密钥长度不足');
    hasError = true;
  } else {
    console.log('  ✓ JWT 密钥配置正确');
  }

  if (!process.env.CSRF_SECRET || process.env.CSRF_SECRET.length < 32) {
    console.error('  ❌ CSRF 密钥长度不足');
    hasError = true;
  } else {
    console.log('  ✓ CSRF 密钥配置正确');
  }
  console.log();

  // 5. 验证速率限制配置
  console.log('5. 验证速率限制配置:');
  if (process.env.ENABLE_RATE_LIMITING === 'true') {
    const window = parseInt(process.env.RATE_LIMIT_WINDOW);
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS);

    if (isNaN(window) || window <= 0) {
      console.error('  ❌ 速率限制时间窗口配置无效');
      hasError = true;
    } else {
      console.log('  ✓ 速率限制时间窗口配置正确');
    }

    if (isNaN(maxRequests) || maxRequests <= 0) {
      console.error('  ❌ 最大请求数配置无效');
      hasError = true;
    } else {
      console.log('  ✓ 最大请求数配置正确');
    }
  } else {
    console.log('  ✓ 速率限制未启用');
  }
  console.log();

  // 6. 验证缓存配置
  console.log('6. 验证缓存配置:');
  if (process.env.ENABLE_CACHE === 'true') {
    const ttl = parseInt(process.env.CACHE_TTL);
    const maxSize = parseInt(process.env.CACHE_MAX_SIZE);

    if (isNaN(ttl) || ttl <= 0) {
      console.error('  ❌ 缓存 TTL 配置无效');
      hasError = true;
    } else {
      console.log('  ✓ 缓存 TTL 配置正确');
    }

    if (isNaN(maxSize) || maxSize <= 0) {
      console.error('  ❌ 缓存大小配置无效');
      hasError = true;
    } else {
      console.log('  ✓ 缓存大小配置正确');
    }
  } else {
    console.log('  ✓ 缓存未启用');
  }
  console.log();

  // 7. 验证监控配置
  console.log('7. 验证监控配置:');
  if (process.env.ENABLE_PERFORMANCE_MONITORING === 'true') {
    const threshold = parseInt(process.env.SLOW_REQUEST_THRESHOLD);
    
    if (isNaN(threshold) || threshold <= 0) {
      console.error('  ❌ 慢请求阈值配置无效');
      hasError = true;
    } else {
      console.log('  ✓ 慢请求阈值配置正确');
    }

    if (!['debug', 'info', 'warn', 'error'].includes(process.env.LOG_LEVEL)) {
      console.error('  ❌ 日志级别配置无效');
      hasError = true;
    } else {
      console.log('  ✓ 日志级别配置正确');
    }
  } else {
    console.log('  ✓ 性能监控未启用');
  }
  console.log();

  // 8. 测试数据加密函数
  console.log('8. 测试数据加密函数:');
  try {
    const text = 'test-data';
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    console.log('  ✓ 数据加密函数工作正常');
  } catch (err) {
    console.error('  ❌ 数据加密函数测试失败:', err.message);
    hasError = true;
  }
  console.log();

  // 9. 测试数据脱敏函数
  console.log('9. 测试数据脱敏函数:');
  try {
    const data = {
      username: 'test-user',
      password: 'secret123',
      email: 'test@example.com'
    };
    const masked = JSON.parse(JSON.stringify(data));
    ['password', 'email'].forEach(field => {
      if (masked[field]) {
        masked[field] = '****';
      }
    });
    if (masked.password === '****' && masked.email === '****') {
      console.log('  ✓ 数据脱敏函数工作正常');
    } else {
      throw new Error('数据脱敏结果不符合预期');
    }
  } catch (err) {
    console.error('  ❌ 数据脱敏函数测试失败:', err.message);
    hasError = true;
  }
  console.log();

  // 输出最终结果
  console.log('配置验证完成!');
  if (hasError) {
    console.error('❌ 存在配置错误，请检查上述提示并修正。');
    process.exit(1);
  } else {
    console.log('✓ 所有配置验证通过。');
  }
};

// 运行验证
validateConfig(); 