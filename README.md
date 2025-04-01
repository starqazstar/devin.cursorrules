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

## 使用说明

1. 高德地图 MCP 服务配置：
- 配置文件位置：`~/.cursor/mcp.json`
- API Key 配置：在 `.env` 文件中设置
- 服务启动命令：`npx @amap/amap-maps-mcp-server`
- 默认服务端口：3000

2. 开发规范：
- 使用 TypeScript 进行开发
- 遵循 RESTful API 设计规范
- 实现完整的错误处理机制
- 添加详细的日志记录

## 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解更多信息。 