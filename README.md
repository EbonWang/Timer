# 极简倒计时

由 `home-3.html` 原型拆出的完整前端项目：满幅破格倒计时舞台，支持目标时刻与快捷分钟两种设定方式。

## 功能

- **目标时间**：选择未来日期时刻，按墙钟剩余秒数倒计时
- **快捷时长**：输入分钟数后立刻开始
- 运行中显示会话编号与设定摘要；结束时全屏提醒并可重置
- 未开始时每秒刷新预览剩余时间（目标模式会随当前时刻变化）

## 开发

需要 Node.js 18+。

```bash
npm install
npm run dev
```

浏览器打开终端提示的本地地址（默认 `http://localhost:5173`）。

```bash
npm test          # 计时工具函数单测
npm run build     # 类型检查 + 生产构建
npm run preview   # 预览 dist
```

## 结构

```
index.html          # 页面骨架
src/main.ts         # 交互绑定
src/countdown.ts    # 纯计时逻辑（可单测）
src/styles.css      # 设计 token 与签名样式
home-3.html         # 原始单文件原型
```
