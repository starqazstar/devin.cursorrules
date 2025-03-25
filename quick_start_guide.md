# Cascade-devin-cursorrules 快速使用指南

## 环境准备

1. **激活虚拟环境**
```bash
# 在项目根目录下
source venv/bin/activate
```

## 核心功能使用指南

### 1. LLM对话功能

#### 使用Anthropic Claude（默认推荐）
```bash
python tools/llm_api.py --prompt "你的问题" --provider anthropic
```

#### 使用DeepSeek
```bash
python tools/llm_api.py --prompt "你的问题" --provider deepseek
```

#### 示例场景
- 代码解释：`python tools/llm_api.py --prompt "解释这段Python代码的功能" --provider anthropic`
- 中文对话：`python tools/llm_api.py --prompt "你好，请介绍一下自己" --provider deepseek`
- 技术咨询：`python tools/llm_api.py --prompt "解释一下Docker的主要概念" --provider anthropic`

### 2. 网页搜索功能

#### 基本搜索
```bash
python tools/search_engine.py "搜索关键词"
```

#### 搜索结果分析（结合LLM）
```bash
# 搜索并用AI分析结果
python tools/search_engine.py "关键词" | python tools/llm_api.py --prompt "分析这些搜索结果" --provider anthropic
```

#### 示例场景
- 技术资讯：`python tools/search_engine.py "Python 3.13 新特性"`
- 问题解决：`python tools/search_engine.py "Django REST framework 教程"`
- 市场调研：`python tools/search_engine.py "2024年AI发展趋势"`

### 3. 网页爬取功能

#### 单个网页爬取
```bash
python tools/web_scraper.py https://example.com
```

#### 多网页并发爬取
```bash
python tools/web_scraper.py --max-concurrent 3 https://site1.com https://site2.com https://site3.com
```

#### 爬取并分析（结合LLM）
```bash
python tools/web_scraper.py https://example.com | python tools/llm_api.py --prompt "总结这个网页的主要内容" --provider anthropic
```

## 高级用法

### 1. 组合功能使用

#### 搜索-爬取-分析流程
```bash
# 1. 先搜索获取相关网页
python tools/search_engine.py "关键词" > search_results.txt

# 2. 提取URL并爬取
cat search_results.txt | grep "URL:" | cut -d' ' -f2 | xargs python tools/web_scraper.py

# 3. 使用AI分析内容
python tools/llm_api.py --prompt "分析这些网页的内容，提供综合报告" --provider anthropic
```

### 2. 自定义配置

#### API密钥更新
编辑 `.env` 文件：
```bash
# 更新API密钥
ANTHROPIC_API_KEY=your_new_key
DEEPSEEK_API_KEY=your_new_key
```

#### 搜索结果数量调整
```bash
python tools/search_engine.py "关键词" --max-results 10
```

## 使用建议

1. **选择合适的模型**
   - Anthropic Claude：适合复杂任务、长文本处理
   - DeepSeek：适合中文处理、技术文档分析

2. **优化搜索效果**
   - 使用精确的关键词
   - 适当限制结果数量
   - 结合AI分析提高效率

3. **网页爬取注意事项**
   - 遵守网站的robots.txt规则
   - 使用适当的并发数
   - 处理大量数据时注意性能

## 常见问题解决

1. **API密钥问题**
   - 检查.env文件配置
   - 确保API密钥有效
   - 查看错误日志

2. **网络问题**
   - 检查网络连接
   - 适当增加超时时间
   - 使用代理（如需要）

3. **性能优化**
   - 调整并发数
   - 使用结果缓存
   - 优化查询策略

## 获取帮助

如需更多帮助：
1. 查看项目文档：`Cascade-devin-cursorrules项目部署和使用指南.md`
2. 查看工作空间总结：`workspace_summary.md`
3. 使用LLM助手：`python tools/llm_api.py --prompt "如何使用..." --provider anthropic` 