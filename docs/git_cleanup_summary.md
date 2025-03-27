# Git 仓库清理操作总结

## 背景

项目中的 `.specstory` 文件夹包含了一些不需要进行版本控制的文件。我们需要：
1. 将该文件夹从Git历史中完全移除
2. 确保未来不会再次追踪该文件夹

## 执行步骤

### 1. 配置 Git 忽略规则

将 `.specstory` 添加到 `.gitignore` 文件中：

```bash
# specstory
.specstory/
```

### 2. 从 Git 历史中移除

使用 `git filter-branch` 命令从所有分支的历史中移除 `.specstory` 文件夹：

```bash
git filter-branch --force --index-filter \
  'git rm -r --cached --ignore-unmatch .specstory' \
  --prune-empty --tag-name-filter cat -- --all
```

### 3. 更新远程仓库

强制推送更改到所有分支和标签：

```bash
git push origin --force --all
git push origin --force --tags
```

### 4. 清理本地仓库

清理本地Git仓库中的备份引用和过期对象：

```bash
# 删除备份引用
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin

# 清理过期的reflog条目
git reflog expire --expire=now --all

# 运行垃圾回收
git gc --prune=now
```

## 结果

1. `.specstory` 文件夹已从所有Git历史中移除
2. 该文件夹已被添加到 `.gitignore`，未来的更改不会被追踪
3. 远程仓库已更新，所有分支和标签都已清理
4. 本地仓库的备份引用和过期对象已清理

## 注意事项

1. 由于使用了 `--force` 推送，这个操作修改了Git历史
2. 如果其他开发者已经克隆了该仓库，他们需要重新克隆或者执行适当的Git命令来同步这些更改
3. 这个操作是不可逆的，请确保在执行前已经备份重要数据 