# 部署文档

## 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- 操作系统：Linux/macOS/Windows

## 安装步骤

1. 克隆代码仓库

```bash
git clone <repository_url>
cd <project_directory>
```

2. 安装依赖

```bash
npm install
```

3. 配置环境变量

复制环境变量模板文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置必要的环境变量：

```env
# API Keys
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# Server Configuration
FRONTEND_PORT=3000
BACKEND_PORT=3002
NODE_ENV=production

# Security Configuration
ENABLE_HTTPS=true
SSL_KEY_PATH=./ssl/private.key
SSL_CERT_PATH=./ssl/certificate.crt
```

4. 配置 SSL 证书（生产环境）

```bash
mkdir ssl
# 将 SSL 证书文件复制到 ssl 目录
cp /path/to/your/private.key ./ssl/
cp /path/to/your/certificate.crt ./ssl/
```

5. 构建前端资源

```bash
npm run build
```

6. 启动服务

开发环境：
```bash
npm run dev
```

生产环境：
```bash
npm run start
```

## 部署配置

### Nginx 配置

```nginx
server {
    listen 80;
    server_name your_domain.com;
    
    # HTTP 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your_domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # SSL 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # 前端静态资源
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
        expires 7d;
        add_header Cache-Control "public, no-transform";
    }

    # API 代理
    location /api {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 安全头
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-XSS-Protection "1; mode=block";
        add_header X-Content-Type-Options "nosniff";
        add_header Referrer-Policy "strict-origin-when-cross-origin";
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';";
    }
}
```

### PM2 配置

创建 `ecosystem.config.js` 文件：

```javascript
module.exports = {
  apps: [{
    name: 'lowcode-platform',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      BACKEND_PORT: 3002
    },
    env_production: {
      NODE_ENV: 'production',
      BACKEND_PORT: 3002
    }
  }]
};
```

启动服务：

```bash
pm2 start ecosystem.config.js --env production
```

## 监控配置

### 日志配置

创建 `logs` 目录：

```bash
mkdir logs
```

配置日志输出：

```javascript
// 在 server.js 中添加
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});
```

### 性能监控

配置性能监控阈值：

```env
ENABLE_PERFORMANCE_MONITORING=true
SLOW_REQUEST_THRESHOLD=1000
LOG_LEVEL=info
```

## 安全配置

1. 配置防火墙规则：

```bash
# 允许 HTTP/HTTPS 流量
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 允许 SSH 访问
sudo ufw allow 22/tcp

# 启用防火墙
sudo ufw enable
```

2. 配置安全头：

在 `server.js` 中添加：

```javascript
const helmet = require('helmet');
app.use(helmet());
```

3. 配置速率限制：

```env
ENABLE_RATE_LIMITING=true
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX_REQUESTS=100
```

## 备份策略

1. 数据备份：

```bash
# 创建备份脚本
mkdir -p scripts/backup
touch scripts/backup/backup.sh
chmod +x scripts/backup/backup.sh
```

编辑 `scripts/backup/backup.sh`：

```bash
#!/bin/bash
BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# 备份配置文件
cp .env "$BACKUP_DIR/env_$DATE.bak"

# 备份日志文件
tar -czf "$BACKUP_DIR/logs_$DATE.tar.gz" logs/

# 保留最近 7 天的备份
find "$BACKUP_DIR" -type f -mtime +7 -delete
```

2. 配置定时任务：

```bash
# 编辑 crontab
crontab -e

# 添加每日备份任务
0 0 * * * /path/to/scripts/backup/backup.sh
```

## 故障恢复

1. 服务重启：

```bash
pm2 restart lowcode-platform
```

2. 回滚部署：

```bash
# 切换到上一个版本
git checkout <previous_version_tag>
npm install
npm run build
pm2 restart lowcode-platform
```

3. 恢复备份：

```bash
# 恢复配置文件
cp /path/to/backups/env_<timestamp>.bak .env

# 恢复日志文件
tar -xzf /path/to/backups/logs_<timestamp>.tar.gz
```

## 维护计划

1. 定期更新：
   - 每周检查依赖更新
   - 每月进行安全补丁更新
   - 每季度进行主要版本更新

2. 性能优化：
   - 每周分析性能监控数据
   - 每月进行性能优化
   - 每季度进行全面性能评估

3. 安全审计：
   - 每周检查安全日志
   - 每月进行安全扫描
   - 每季度进行安全审计 