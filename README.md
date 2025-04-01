# devin.cursorrules

基于 [grapeot/devin.cursorrules](https://github.com/grapeot/devin.cursorrules) 的增强版本，添加了高德地图 MCP 服务支持和旅游规划功能。

## 功能特点

- 支持高德地图 MCP 服务
- 旅游路线规划
- 地理编码和逆地理编码
- 天气查询
- POI 搜索
- 路径规划（驾车、步行、骑行、公交）
- 距离测量

## 目录结构

```
.
├── src/                # 源代码目录
│   ├── assets/        # 静态资源
│   ├── components/    # 组件
│   ├── interfaces/    # 类型定义
│   ├── pages/        # 页面
│   ├── services/     # 服务
│   ├── styles/       # 样式
│   ├── utils/        # 工具函数
│   └── examples/     # 示例代码
├── docs/              # 文档目录
│   ├── api/          # API 文档
│   ├── deployment/   # 部署文档
│   ├── development/  # 开发文档
│   └── maintenance/  # 维护文档
├── scripts/           # 脚本目录
├── tests/            # 测试文件目录
├── tools/            # 工具脚本目录
└── .config/          # 配置目录
```

## 快速开始

1. 克隆仓库：
```bash
git clone https://github.com/starqazstar/devin.cursorrules.git
cd devin.cursorrules
```

2. 安装依赖：
```bash
# 安装 Python 依赖
python -m venv venv
source venv/bin/activate  # Windows 使用 venv\Scripts\activate
pip install -r requirements.txt

# 安装 Node.js 依赖
npm install
```

3. 配置环境变量：
```bash
cp .env.example .env
# 编辑 .env 文件，填入必要的配置信息
```

4. 启动服务：
```bash
# 启动高德地图 MCP 服务
npx @amap/amap-maps-mcp-server

# 启动开发服务器
npm run dev
```

## 开发规范

### 环境配置规范

- 使用 .env 文件管理所有环境变量
- 区分开发和生产环境配置
- 敏感信息（如 API 密钥）必须通过环境变量传递
- 提供 .env.example 作为配置模板

### 服务配置
- 前端服务默认端口：3000
- 后端服务默认端口：3002
- API 基础路径配置在环境变量中
- 超时时间、重试次数等通过配置对象管理

### 代码规范
- 使用 TypeScript 进行开发
- 遵循 RESTful API 设计规范
- 实现完整的错误处理机制
- 添加详细的日志记录
- 确保代码注释完整

### 文件命名规范
1. 组件文件：使用 PascalCase（如 `Button.tsx`）
2. 工具文件：使用 camelCase（如 `formatDate.ts`）
3. 样式文件：与组件同名（如 `Button.css`）
4. 测试文件：添加 .test 或 .spec 后缀（如 `Button.test.tsx`）
5. 类型定义文件：使用 .d.ts 后缀（如 `types.d.ts`）

## 高德地图 MCP 服务

### 配置说明
- 配置文件位置：`~/.cursor/mcp.json`
- API Key 配置：在 `.env` 文件中设置
- 服务启动命令：`npx @amap/amap-maps-mcp-server`
- 默认服务端口：3000

### 使用规则
- 启动服务前确保 mcp.json 格式正确
- API Key 必须通过环境变量配置
- 服务健康检查：curl http://localhost:3000/health
- 所有请求需要添加错误重试机制
- 注意请求频率限制

### 安全规则
- API Key 必须通过环境变量管理
- 敏感配置信息不得硬编码
- 实现请求签名验证
- 数据传输使用 HTTPS

### 性能规则
- 实现请求缓存机制
- 控制并发请求数量
- 优化响应时间
- 监控服务资源使用

## 测试规范

### 测试要求
- 单元测试覆盖
- 接口测试覆盖
- 性能测试覆盖
- 错误处理测试

### 测试流程
- 服务启动前进行配置验证
- 定期检查服务健康状态
- 保存测试结果日志
- 监控 API 调用限制

## 维护规范

### 日常维护
- 定期检查日志
- 监控性能指标
- 更新依赖版本
- 备份配置文件

### 问题处理
- 记录问题详情
- 分析根本原因
- 制定解决方案
- 更新文档说明

## 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解更多信息。 