# Cascade-devin-cursorrules 部署和使用指南

本文档详细介绍了如何部署、配置和使用Cascade-devin-cursorrules项目，以便在Windsurf IDE中获得类似Devin的AI助手功能。

## 目录

- [项目概述](#项目概述)
- [部署步骤](#部署步骤)
  - [环境准备](#环境准备)
  - [获取项目文件](#获取项目文件)
  - [配置API密钥](#配置api密钥)
  - [验证部署](#验证部署)
- [使用指南](#使用指南)
  - [LLM集成](#llm集成)
  - [网页搜索](#网页搜索)
  - [网页爬取](#网页爬取)
  - [截图验证](#截图验证)
  - [一体化助手](#一体化助手)
- [常见问题](#常见问题)
- [高级定制](#高级定制)

## 项目概述

Cascade-devin-cursorrules是一个为Windsurf IDE定制的AI助手增强项目，旨在提供类似Devin的智能编码助手功能。主要特性包括：

1. **自我规划能力**：能够分解任务并逐步执行
2. **网页交互**：提供网页搜索和内容爬取能力
3. **自我进化**：能够学习并改进自身表现
4. **LLM驱动分析**：使用大语言模型进行复杂分析

## 部署步骤

### 环境准备

1. **Python环境**：确保已安装Python 3.9或更高版本

2. **创建并激活虚拟环境**：

```bash
# 进入项目目录
cd /path/to/devin-cursorrules

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

3. **安装依赖**：

```bash
pip install -r requirements.txt

# 额外依赖
pip install beautifulsoup4 html5lib duckduckgo_search playwright
playwright install
```

### 获取项目文件

确保项目根目录中包含以下关键文件：

1. **配置文件**：
   - `.windsurfrules`：Windsurf规则配置文件
   - `scratchpad.md`：AI助手的记事本和学习日志
   - `.env`或`.env.example`：环境变量配置模板

2. **工具目录**：
   - `tools/llm_api.py`：LLM API接口
   - `tools/search_engine.py`：搜索引擎工具
   - `tools/web_scraper.py`：网页爬取工具
   - `tools/screenshot_utils.py`：网页截图工具

### 配置API密钥

1. **创建或编辑.env文件**：
   
```bash
# 复制示例配置
cp .env.example .env
```

2. **添加必要的API密钥**：

```bash
# .env文件内容示例
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxx
# 可选的其他API密钥
# OPENAI_API_KEY=sk-xxxxxxxxxxxx
# GOOGLE_API_KEY=xxxxxxxxxxxx
# DEEPSEEK_API_KEY=xxxxxxxxxxxx
```

Anthropic API密钥是必需的，其他API密钥可以根据需要添加。

### 验证部署

执行以下命令验证各项功能是否正常：

1. **验证LLM集成**：

```bash
# 激活虚拟环境
source venv/bin/activate

# 测试LLM API
python tools/llm_api.py --prompt "测试问题" --provider anthropic
```

2. **验证搜索功能**：

```bash
python tools/search_engine.py "搜索关键词" --max-results 3
```

3. **验证网页爬取**：

```bash
python tools/web_scraper.py https://example.com
```

## 使用指南

### LLM集成

LLM集成支持多种提供商，默认使用Anthropic的Claude模型：

```bash
# 基本使用
python tools/llm_api.py --prompt "你的问题" --provider anthropic

# 在Python代码中使用
from tools.llm_api import query_llm
response = query_llm("你的问题", provider="anthropic")
print(response)
```

**支持的提供商**：
- `anthropic`：使用Claude-3 Sonnet模型（推荐）
- `openai`：使用GPT-4o模型（需要OpenAI API密钥）
- `gemini`：使用Gemini Pro模型（需要Google API密钥）
- `deepseek`：使用DeepSeek Chat模型（需要DeepSeek API密钥）

### 网页搜索

搜索功能使用DuckDuckGo作为后端，无需API密钥：

```bash
# 基本搜索
python tools/search_engine.py "搜索关键词"

# 限制结果数量
python tools/search_engine.py "搜索关键词" --max-results 5

# 在Python代码中使用
from tools.search_engine import search_with_retry
results = search_with_retry("搜索关键词", max_results=3)
for result in results:
    print(f"URL: {result.get('href')}")
    print(f"标题: {result.get('title')}")
    print(f"摘要: {result.get('body')}")
```

### 网页爬取

网页爬取工具支持并发处理多个URL：

```bash
# 爬取单个网页
python tools/web_scraper.py https://example.com

# 并发爬取多个网页
python tools/web_scraper.py --max-concurrent 3 https://example.com https://example.org https://example.net

# 在Python代码中使用
from tools.web_scraper import process_urls
import asyncio

async def scrape_sites():
    urls = ["https://example.com", "https://example.org"]
    contents = await process_urls(urls)
    for url, content in zip(urls, contents):
        print(f"Content from {url}: {content[:200]}...")

asyncio.run(scrape_sites())
```

### 截图验证

截图验证工具可以捕获网页截图并使用LLM分析：

```bash
# 捕获网页截图
python tools/screenshot_utils.py https://example.com --output screenshot.png

# 使用LLM分析截图
python tools/llm_api.py --prompt "描述这个网页的主要内容" --provider anthropic --image screenshot.png

# 在Python代码中使用
from tools.screenshot_utils import take_screenshot_sync
from tools.llm_api import query_llm

screenshot_path = take_screenshot_sync('https://example.com', 'screenshot.png')
analysis = query_llm(
    "描述这个网页的主要内容和布局",
    provider="anthropic",
    image_path=screenshot_path
)
print(analysis)
```

### 一体化助手

项目提供了一个集成所有功能的演示脚本`assistant_demo.py`：

```bash
# 仅搜索
python assistant_demo.py "搜索关键词"

# 搜索并分析
python assistant_demo.py "搜索关键词" --analyze

# 搜索、爬取和分析
python assistant_demo.py "搜索关键词" --scrape --analyze

# 指定LLM提供商
python assistant_demo.py "搜索关键词" --provider anthropic --analyze
```

## 常见问题

### API密钥问题

**问题**：运行LLM相关命令时出现API密钥错误  
**解决方案**：
1. 确认`.env`文件存在且包含正确的API密钥
2. 检查API密钥格式是否正确
3. 明确指定提供商：`--provider anthropic`

### 网络问题

**问题**：网页爬取或搜索超时  
**解决方案**：
1. 检查网络连接
2. 对于爬取功能，可以增加超时时间：`--timeout 30`
3. 对于搜索功能，可以重试：`--retries 3`

### 环境问题

**问题**：导入模块错误  
**解决方案**：
1. 确认虚拟环境已激活
2. 检查是否安装了所有依赖：`pip install -r requirements.txt`
3. 安装缺失的依赖：`pip install <缺失的包名>`

## 高级定制

### 自定义LLM提示

可以通过修改`tools/llm_api.py`中的提示模板来自定义LLM行为：

```python
# 修改系统提示以定制LLM行为
SYSTEM_PROMPTS = {
    "anthropic": "你是一位专业的AI助手...",
    "openai": "你是一位专业的AI助手...",
    # 其他提供商
}
```

### 添加新工具

要添加新工具，可以在`tools`目录中创建新的Python模块，然后在`.windsurfrules`文件中添加相应的使用说明。

### 扩展搜索引擎

项目默认使用DuckDuckGo作为搜索后端，如需添加其他搜索引擎支持：

1. 在`tools/search_engine.py`中添加新的搜索函数
2. 更新搜索函数以接受统一的参数格式
3. 在命令行接口中添加新的搜索引擎选项

---

通过以上步骤，您应该能够成功部署和使用Cascade-devin-cursorrules项目，获得类似Devin的AI助手体验。如有任何问题或需要进一步帮助，请参考项目文档或联系项目维护者。
