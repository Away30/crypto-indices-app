# 🎥 Loom 视频录制完整指南

## 目标：录制一个 8-10 分钟的专业演示视频

---

## 📋 准备工作（5分钟）

### 1. 安装 Loom

**选项 1：Chrome 扩展（推荐）**
1. 访问 [Chrome Web Store](https://chrome.google.com/webstore)
2. 搜索 "Loom"
3. 点击 "Add to Chrome" 安装
4. 注册免费账号

**选项 2：桌面应用**
1. 访问 [loom.com/download](https://www.loom.com/download)
2. 下载 Mac 版本
3. 安装并注册

### 2. 准备录制环境

#### 浏览器设置
```bash
# 打开你的部署应用
https://你的vercel-url.vercel.app

# 准备多个标签页：
- 标签 1: 主页
- 标签 2: BTC 详情页
- 标签 3: ETH 详情页（可选）
- 标签 4: GitHub 仓库
- 标签 5: README.md
```

#### 浏览器窗口
- 关闭不相关的标签
- 设置合适的窗口大小（1280x720 或更大）
- 清除浏览器缓存（确保演示真实 API 调用）

#### 编辑器（VSCode）
```bash
# 打开关键文件
- src/lib/api/coinapi.ts
- src/app/api/indices/route.ts
- README.md
- .env.example
```

### 3. 测试录制

录制一个 30 秒的测试视频：
1. 点击 Loom 图标
2. 选择 "Screen + Camera"
3. 选择要录制的窗口
4. 录制 30 秒
5. 观看回放，检查：
   - ✅ 音频清晰
   - ✅ 画面清晰
   - ✅ 摄像头位置合适
   - ✅ 无背景噪音

---

## 🎬 视频脚本（8-10 分钟）

### 开场（30 秒）

**画面**：摄像头 + 应用主页

**话术**：
```
Hi, my name is Leqi, and I'm excited to present my crypto indices dashboard
project for the Full-Stack Developer position.

This is a production-ready web application that tracks cryptocurrency indices
with 30-day historical analysis, built with Next.js 16, React 19, and integrated
with real-time CoinAPI data.

Let me walk you through the key features and technical implementation.
```

**要点**：
- 微笑，保持自然
- 清晰说出你的名字
- 简要介绍项目

---

### 第一部分：功能演示（4 分钟）

#### 1.1 主页概览（1 分钟）

**画面**：缓慢滚动主页

**话术**：
```
Here we have the main dashboard displaying six cryptocurrency indices:
Bitcoin, Ethereum, Binance Coin, Solana, Cardano, and Ripple.

[指向卡片]
Each card shows:
- Real-time price from CoinAPI
- 24-hour price change with percentage
- Market capitalization
- 24-hour trading volume

[指向顶部状态栏]
The status bar shows our API rate limiting and caching information.
Currently, we have [X] requests remaining out of 20 per minute.

[点击刷新按钮]
Let me refresh the data. Notice how quick this is - that's because of our
smart caching system. The data is cached for 120 seconds to optimize API usage
while still providing fresh information.
```

**操作**：
- 鼠标悬停在卡片上
- 指向关键信息
- 点击刷新按钮
- 等待数据加载（展示加载状态）

#### 1.2 详情页演示（2 分钟）

**画面**：点击 BTC 卡片进入详情页

**话术**：
```
Now let's dive into the 30-day detail view by clicking on Bitcoin.

[页面加载]
Here we see comprehensive historical analysis:

[指向价格图表]
The price chart shows 30 days of real OHLCV data from CoinAPI.
All of this data comes directly from Bitstamp exchange through CoinAPI's
OHLCV endpoint, which gives us open, high, low, close prices and trading volume.

[悬停在图表上]
The chart is interactive - you can hover over any point to see the exact
values for that day.

[滚动到交易量图表]
Below we have the 24-hour trading volume for each day, also from real API data.

[指向技术指标]
On the right, we display technical indicators:
- SMA (Simple Moving Average) calculated from the real data
- RSI (Relative Strength Index) showing market momentum
- And trading signals based on these indicators

[指向统计摘要]
And here's a 30-day summary showing the price range, total change in both
dollars and percentage.
```

**操作**：
- 缓慢滚动页面
- 鼠标悬停在图表上展示工具提示
- 指向每个部分

#### 1.3 响应式设计（30 秒）

**画面**：打开 Chrome DevTools，切换设备视图

**话术**：
```
The application is fully responsive. Let me show you how it looks on mobile.

[切换到 iPhone 视图]
As you can see, the layout adapts perfectly to mobile devices.
The cards stack vertically, and all functionality remains accessible.

[切换回桌面]
This ensures a great user experience across all devices.
```

**操作**：
- F12 打开 DevTools
- 点击设备工具栏图标
- 切换不同设备尺寸

#### 1.4 实时数据验证（30 秒）

**画面**：打开 CoinMarketCap 标签页对比

**话术**：
```
To verify the data is real, let me compare it with CoinMarketCap.

[切换到 CoinMarketCap]
Here on CoinMarketCap, Bitcoin is trading at around [X] dollars.

[切换回你的应用]
And in our application, you can see the price is [Y] dollars, which is
very close. The small difference is because we use Bitstamp exchange data,
while CoinMarketCap shows an average across multiple exchanges.

This confirms we're pulling 100% real data from CoinAPI.
```

---

### 第二部分：技术实现（3 分钟）

#### 2.1 架构概览（45 秒）

**画面**：切换到 GitHub 仓库

**话术**：
```
Let me show you the technical implementation.

[展示项目结构]
The project is built with:
- Next.js 16 using the App Router for server-side rendering
- React 19 for the UI components
- TypeScript for type safety
- TailwindCSS for styling

[点击 src 文件夹]
The architecture follows best practices with clear separation:
- API routes for backend logic
- Components for UI
- Library code for external integrations
- Utility functions and custom hooks
```

**操作**：
- 展示 README.md
- 滚动项目结构部分
- 点击文件夹展开

#### 2.2 API 集成（1 分钟）

**画面**：打开 `src/lib/api/coinapi.ts`

**话术**：
```
Here's our CoinAPI integration.

[滚动到 getExchangeRates 方法]
For the main page, we use an intelligent approach: we fetch OHLCV data
with a limit of 2 days. This gives us today's price AND yesterday's price
in a single API call.

[指向代码]
From this one call, we extract:
- Current price from today's closing price
- 24-hour change by comparing today and yesterday
- Real trading volume from the OHLCV data

This is much more efficient than making separate calls for each data point.

[滚动到 getHistoricalData 方法]
For the 30-day historical data, we call the OHLCV endpoint with limit 31,
which gives us a full month of real market data.

[指向 fallback 方法]
We also have a multi-exchange fallback system. If Bitstamp data is unavailable,
we automatically try Coinbase, Kraken, and Binance to ensure reliability.
```

**操作**：
- 滚动代码，突出关键部分
- 指向重要的函数和注释

#### 2.3 缓存策略（1 分钟）

**画面**：打开 `src/lib/cache/index.ts` 和 README.md 缓存章节

**话术**：
```
One of the key requirements was implementing a caching system.

[展示 cache 代码]
We use Node-Cache for in-memory caching with a configurable TTL.
The default is 120 seconds, which balances fresh data with API quota management.

[切换到 README]
Here in the documentation, I've detailed the entire caching strategy:
- How it works
- Cache flow diagram
- Configuration options
- Performance benefits

[指向缓存流程图]
The flow is simple: check cache first, if miss, call API, store in cache,
return data. This reduces API calls by about 80-90%.

With the free CoinAPI plan allowing 100 requests per day, our caching ensures
we can support many users without hitting the limit.
```

**操作**：
- 展示代码
- 展示 README 的缓存章节
- 指向流程图

#### 2.4 速率限制（30 秒）

**画面**：API 路由代码

**话术**：
```
We also implemented rate limiting to respect the API plan limits.

[展示 RateLimiter 类]
The rate limiter checks two constraints:
- 20 requests per minute
- 500 requests per month

Before each API call, we verify we haven't exceeded these limits.
If we have, we return cached data or an error, protecting us from
going over quota.

This is production-ready defensive programming.
```

---

### 第三部分：数据真实性证明（45 秒）

**画面**：浏览器 DevTools Network 标签

**话术**：
```
Let me prove that all data comes from real API calls.

[打开 Network 标签]
I'll refresh the page and show you the actual API requests.

[点击刷新，等待请求]
Here you can see our API route being called: /api/indices

[点击请求查看详情]
And if we look at the response, you can see it contains real data
with the "cached: false" flag, meaning this came from a fresh API call.

[点击 Preview 标签]
All the prices, volumes, and changes you see here are 100% real data
from CoinAPI's OHLCV endpoints.
```

**操作**：
- 打开 DevTools
- 切换到 Network 标签
- 刷新页面
- 点击 API 请求
- 展示响应数据

---

### 第四部分：文档和部署（30 秒）

**画面**：GitHub README

**话术**：
```
Finally, I've created comprehensive documentation.

[滚动 README]
The README includes:
- Complete setup instructions
- Detailed caching strategy explanation
- API documentation with examples
- Deployment guide
- Environment variable configuration

[展示其他文档]
I also created additional guides for:
- Real API implementation details
- Vercel deployment steps
- Troubleshooting common issues

Everything is well-documented and production-ready.
```

---

### 总结（30 秒）

**画面**：回到应用主页，摄像头

**话术**：
```
To summarize, this project demonstrates:
- Full-stack development with modern technologies
- Real API integration with 100% authentic data
- Smart caching and rate limiting for production use
- Responsive design for all devices
- Clean, maintainable, well-documented code

All requirements from the assignment have been met and exceeded.

The live application is deployed at [说出你的 URL],
the source code is on GitHub at [你的仓库],
and all documentation is included.

Thank you for watching, and I look forward to discussing this project
with you in the next interview!
```

**要点**：
- 微笑，保持自信
- 清晰说出 URL（也在屏幕上显示）
- 表达感谢和期待

---

## 🎯 录制技巧

### 声音
- ✅ 使用耳机麦克风或外置麦克风
- ✅ 在安静的环境录制
- ✅ 说话清晰、节奏适中
- ✅ 避免 "um", "ah", "like" 等填充词
- ✅ 适当停顿，让观众消化信息

### 画面
- ✅ 关闭通知（勿扰模式）
- ✅ 隐藏敏感信息（API Key, 邮箱等）
- ✅ 鼠标移动要慢，给观众时间看清
- ✅ 使用鼠标高亮重要区域
- ✅ 避免频繁切换窗口

### 节奏
- ✅ 演示功能时，等待加载完成再说话
- ✅ 代码部分可以稍快，但要清晰
- ✅ 重要概念要重复说明
- ✅ 使用过渡语句："Now let's...", "Next, I'll show..."

### 专业性
- ✅ 着装得体（商务休闲）
- ✅ 保持微笑和眼神交流（看镜头）
- ✅ 背景整洁
- ✅ 光线充足

---

## 📝 录制检查清单

### 准备阶段
- [ ] Loom 已安装并测试
- [ ] 应用已部署并正常运行
- [ ] 所有标签页已准备
- [ ] VSCode 已打开关键文件
- [ ] 浏览器缓存已清除
- [ ] 通知已关闭
- [ ] 环境安静

### 录制设置
- [ ] 选择 "Screen + Camera" 模式
- [ ] 摄像头位置合适（右下角）
- [ ] 麦克风测试正常
- [ ] 窗口大小适中（1280x720+）

### 内容检查
- [ ] 开场介绍清晰
- [ ] 功能演示完整
- [ ] 技术讲解清楚
- [ ] 数据真实性证明
- [ ] 文档展示充分
- [ ] 总结有力

### 质量检查
- [ ] 时长 8-10 分钟
- [ ] 音频清晰无杂音
- [ ] 画面清晰可读
- [ ] 无明显错误或口误
- [ ] 流畅自然

---

## 💡 常见问题

### Q: 如果录制中出错了怎么办？
**A**:
- 小错误：继续录制，后续用 Loom 的修剪功能剪掉
- 大错误：暂停，重新开始该部分
- Loom 支持暂停和继续录制

### Q: 时长超过 10 分钟怎么办？
**A**:
1. 使用 Loom 编辑器修剪不必要的部分
2. 加快代码演示部分的节奏
3. 减少重复说明

### Q: 时长不足 8 分钟怎么办？
**A**:
- 添加更多技术细节讲解
- 展示更多代码文件
- 详细说明缓存和速率限制的实现

### Q: 需要显示脸部吗？
**A**:
- 推荐显示，更有亲和力
- 如果不舒服可以只录屏
- 至少在开场和结尾露脸

### Q: 可以用脚本吗？
**A**:
- 可以参考脚本，但不要逐字朗读
- 保持自然对话的语气
- 适当即兴发挥

---

## 🎬 录制后

### 1. 审查视频（5分钟）

完整观看一遍，检查：
- ✅ 音频清晰
- ✅ 画面清晰
- ✅ 无明显错误
- ✅ 时长合适
- ✅ 所有功能都演示了

### 2. 编辑视频（可选，5分钟）

使用 Loom 编辑器：
- 修剪开头/结尾的沉默
- 删除明显错误的部分
- 添加关键时刻的标记（Chapters）

### 3. 添加描述

在 Loom 视频描述中添加：
```
Crypto Indices Dashboard - Take Home Assignment
Developer: Leqi
Position: Crypto Full-Stack Developer Intern

🔗 Links:
- Live App: https://你的vercel-url.vercel.app
- GitHub: https://github.com/你的用户名/crypto-indices-app
- Documentation: See README.md in repository

✨ Key Features:
- 6 cryptocurrency indices with real-time data
- 30-day historical OHLCV analysis
- 100% real CoinAPI integration
- Smart caching (120s TTL)
- Rate limiting (20/min, 500/month)
- Technical indicators (SMA, RSI)
- Responsive design
- Production-ready deployment

🛠️ Tech Stack:
Next.js 16, React 19, TypeScript 5, TailwindCSS 4,
Node-Cache, Recharts, CoinAPI

Timeline:
0:00 - Introduction
0:30 - Dashboard Overview
1:30 - 30-Day Detail View
3:30 - Responsive Design
4:00 - Technical Implementation
6:00 - API Integration
7:00 - Caching Strategy
8:00 - Documentation
8:30 - Summary

Thank you for watching!
```

### 4. 设置隐私

- 选择 **Unlisted**（推荐）- 只有有链接的人能看
- 或 **Public** - 任何人都能看

不要选 Private（招聘方看不到）。

### 5. 获取分享链接

复制 Loom 视频链接：
```
https://www.loom.com/share/你的视频ID
```

测试链接在无痕窗口是否可以访问。

---

## 🚀 录制时间规划

| 任务 | 预计时间 |
|------|---------|
| 准备环境 | 5 分钟 |
| 测试录制 | 5 分钟 |
| 正式录制 | 10-15 分钟（可能需要多次） |
| 审查和编辑 | 10 分钟 |
| 总计 | 30-35 分钟 |

---

## ✅ 最终检查

录制完成后，确认：

```
视频质量
├─ [✓] 时长 8-10 分钟
├─ [✓] 音频清晰
├─ [✓] 画面清晰
├─ [✓] 无明显错误
└─ [✓] 流畅自然

内容完整性
├─ [✓] 介绍了自己和项目
├─ [✓] 演示了所有主要功能
├─ [✓] 讲解了技术实现
├─ [✓] 证明了数据真实性
├─ [✓] 展示了文档
└─ [✓] 有力的总结

专业性
├─ [✓] 语言清晰
├─ [✓] 节奏适中
├─ [✓] 自信得体
└─ [✓] 有吸引力

技术深度
├─ [✓] 讲解了缓存策略
├─ [✓] 说明了速率限制
├─ [✓] 展示了代码质量
└─ [✓] 强调了实际 API 集成
```

---

## 🎊 完成！

你现在有一个专业的演示视频，准备提交给招聘方！

**Loom 链接**: `https://www.loom.com/share/你的视频ID`

---

**更新时间**: 2025-11-06
**预计录制时间**: 30-35 分钟
**难度**: ⭐⭐⭐☆☆ 中等
