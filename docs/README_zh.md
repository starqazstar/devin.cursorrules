# 将你的 $20 Cursor 转变为类似 Devin 的 AI 助手

这个代码库提供了所有必要的工具，让你以极低的成本将 Cursor/Windsurf IDE 或 GitHub Copilot 升级为具有**高级**智能代理能力的助手——类似于每月 $500 的 Devin。只需不到一分钟，你将获得：

* 自动规划和自我进化，让你的 AI "三思而后行"并从错误中学习
* 扩展工具使用，包括网页浏览、搜索引擎查询和基于 LLM 的文本/图像分析
* [实验性功能] 多智能体协作，由 o1 负责规划，常规 Claude/gpt-4o-mini-minio 负责执行

## 为什么这很重要

Devin 给人留下深刻印象的原因在于它能像实习生一样制定自己的计划，在进行过程中更新计划，甚至根据你的反馈进行自我进化。但你不需要支付 Devin 每月 $500 的订阅费就能获得大部分功能。通过自定义 .cursorrules 文件和几个 Python 脚本，你可以在 Cursor 中解锁相同的高级功能。

## 主要亮点

1. 简易设置
   
   两种入门方式：

   **选项 1：使用 Cookiecutter（推荐）**
   ```bash
   # 如果尚未安装 cookiecutter，请先安装
   pip install cookiecutter

   # 创建新项目
   cookiecutter gh:grapeot/devin.cursorrules --checkout template
   ```

   **选项 2：手动设置**
   将 `tools` 文件夹和以下配置文件复制到项目根目录：Windsurf 用户需要 `.windsurfrules` 和 `scratchpad.md` 文件。Cursor 用户只需要 `.cursorrules` 文件。Github Copilot 用户需要 `.github/copilot-instructions.md` 文件。

2. 规划者-执行者多智能体系统（实验性）

   我们新的[多智能体分支](https://github.com/grapeot/devin.cursorrules/tree/multi-agent)引入了由 o1 驱动的高级规划者，负责协调复杂任务，以及由 Claude/GPT 驱动的执行者，负责逐步实施操作。这种双智能体方法大大提高了解决方案质量、交叉检查和迭代速度。

3. 扩展工具集

   包括：
   
   * 网页抓取（Playwright）
   * 搜索引擎集成（DuckDuckGo）
   * LLM 驱动的分析

   AI 会自动决定如何以及何时使用这些工具（就像 Devin 一样）。

   注意：对于截图验证功能，当你首次使用该功能时，Playwright 浏览器将自动安装。

4. 自我进化

   每当你纠正 AI 时，它可以在 .cursorrules 中更新其"经验教训"。随着时间推移，它会积累项目特定知识，并在每次迭代中变得更智能。这使 AI 成为一个可教导且值得指导的合作伙伴。
	
## 使用方法

有关使用 Cursor 设置和使用 devin.cursorrules 的详细步骤，请查看我们的[分步教程](step_by_step_tutorial.md)。该指南涵盖了从初始 Cursor 设置到配置 devin.cursorrules 和使用增强功能的所有内容。

1. 选择你的设置方法：
   - **Cookiecutter（推荐）**：运行 cookiecutter 命令后按提示操作
   - **手动**：从此代码库复制你需要的文件

2. 配置你的环境：
   - 设置你的 API 密钥（可选）

3. 开始探索高级任务——如数据收集、构建快速原型或交叉引用外部资源——以完全智能化的方式。

## 想了解更多细节？

查看我们的[博客文章](https://yage.ai/cursor-to-devin-en.html)，了解我们如何在短短一小时内将 $20 转变为 $500 级别的 AI 能力。文章解释了流程规划、自我进化和全自动工作流背后的理念。你还将找到 Devin、Cursor 和 Windsurf 的并排比较，以及从头开始设置所有这些的分步教程。

许可证：MIT