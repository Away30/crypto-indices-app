# 🌐 真实 API 使用指南

## 概述

本应用现在使用 **真实的 CoinAPI** 获取加密货币数据。本文档说明如何配置和使用真实 API。

---

## ✅ 已实现的真实 API 调用

### 1. 实时价格获取
- **端点**: `/v1/exchangerate/{SYMBOL}/USD`
- **支持币种**: BTC, ETH, BNB, SOL, ADA, XRP
- **数据**: 100% 真实的实时价格

### 2. 30天历史 OHLCV 数据
- **端点**: `/v1/ohlcv/latest`
- **数据**: 100% 真实的开盘价、最高价、最低价、收盘价、交易量
- **备用交易所**: Bitstamp → Coinbase → Kraken → Binance

---

## 🔑 获取 API Key

### 步骤 1: 注册 CoinAPI 账号
1. 访问 [CoinAPI.io](https://www.coinapi.io/)
2. 点击 "Get Free API Key"
3. 填写注册信息
4. 验证邮箱

### 步骤 2: 获取 API Key
1. 登录后进入 Dashboard
2. 复制你的 API Key
3. 免费计划提供：
   - **100 次请求/天**
   - **100,000 次请求/月**

### 步骤 3: 配置环境变量
```bash
# 在项目根目录创建 .env.local
echo "COINAPI_KEY=你的API_KEY_在这里" > .env.local
```

---

## 📊 API 使用情况

### 主页加载（无缓存）
```
获取 6 个加密货币价格:
├─ GET /v1/exchangerate/BTC/USD  ✅ 真实
├─ GET /v1/exchangerate/ETH/USD  ✅ 真实
├─ GET /v1/exchangerate/BNB/USD  ✅ 真实
├─ GET /v1/exchangerate/SOL/USD  ✅ 真实
├─ GET /v1/exchangerate/ADA/USD  ✅ 真实
└─ GET /v1/exchangerate/XRP/USD  ✅ 真实

总计: 6 次 API 调用
```

### 详情页加载（无缓存）
```
获取 30 天历史数据:
└─ GET /v1/ohlcv/latest?symbol_id=BITSTAMP_SPOT_BTC_USD&period_id=1DAY&limit=31

总计: 1 次 API 调用
```

### 有缓存时
```
主页加载: 0 次 API 调用（从缓存读取）
详情页: 0 次 API 调用（从缓存读取）

缓存有效期: 120 秒（可配置）
```

---

## ⚡ 缓存策略（重要！）

### 为什么需要缓存？
免费 API 每天只有 100 次请求，没有缓存会很快用完。

### 缓存如何工作？
```
首次访问主页:
├─ 调用 6 次 API
├─ 存入缓存（TTL: 120秒）
└─ 返回数据

2分钟内再次访问:
├─ 从缓存读取（0次 API 调用）
└─ 返回缓存数据

2分钟后访问:
├─ 缓存过期
├─ 重新调用 API
└─ 更新缓存
```

### 配置缓存时长
```bash
# .env.local

# 60秒缓存 - 更新频繁，但 API 调用多
CACHE_DURATION_SECONDS=60

# 120秒缓存 - 推荐，平衡实时性和配额
CACHE_DURATION_SECONDS=120

# 300秒缓存 - 最大化节省配额
CACHE_DURATION_SECONDS=300
```

---

## 📈 每日配额估算

### 场景 1: 轻度使用（120秒缓存）
- 10 个用户访问主页
- 5 个用户查看详情页
- **总 API 调用**: ~15 次 ✅ 远低于 100 次限制

### 场景 2: 中度使用（120秒缓存）
- 50 个用户访问主页
- 20 个用户查看详情页
- **总 API 调用**: ~70 次 ✅ 在限制内

### 场景 3: 高度使用（60秒缓存）
- 100 个用户访问主页
- 50 个用户查看详情页
- **总 API 调用**: ~150 次 ⚠️ 可能超限

**建议**: 保持 120 秒缓存时长

---

## 🛡️ 速率限制保护

### 内置保护机制
```typescript
// 自动检查速率限制
if (!rateLimiter.canMakeRequest()) {
  return { error: 'Rate limit exceeded' };
}

// 配置
MAX_REQUESTS_PER_MINUTE=20  // 每分钟最多 20 次
MAX_REQUESTS_PER_MONTH=500   // 每月最多 500 次
```

### 超限时的行为
1. 检测到超限 → 返回缓存数据（如果有）
2. 显示错误提示：`"API rate limit reached, showing cached data"`
3. 等待速率限制重置

---

## 🔍 监控 API 使用

### 访问状态页面
```
http://localhost:3000/api/status
```

返回：
```json
{
  "success": true,
  "data": {
    "rateLimit": {
      "requestsRemaining": 15,  // 剩余请求数
      "resetTime": 1699272000000
    },
    "cache": {
      "hits": 145,   // 缓存命中次数
      "misses": 12,  // 缓存未命中次数
      "keys": 7      // 缓存键数量
    }
  }
}
```

### UI 显示
主页顶部状态栏显示：
- `Requests Remaining: 15/20 (per min)`
- `Cache Hits: 145`

---

## 🚀 最佳实践

### 1. 开发环境
```bash
# .env.local
CACHE_DURATION_SECONDS=60   # 快速看到数据变化
MAX_REQUESTS_PER_MINUTE=20
```

### 2. 生产环境
```bash
# .env.local
CACHE_DURATION_SECONDS=120  # 平衡实时性和配额
MAX_REQUESTS_PER_MINUTE=20
MAX_REQUESTS_PER_MONTH=500
```

### 3. 演示环境（有限配额）
```bash
# .env.local
CACHE_DURATION_SECONDS=300  # 5分钟缓存
MAX_REQUESTS_PER_MINUTE=10  # 降低速率
MAX_REQUESTS_PER_MONTH=100  # 匹配免费限制
```

---

## ❓ 常见问题

### Q1: 如何知道我用了多少 API 配额？
**A**: 访问 [CoinAPI Dashboard](https://www.coinapi.io/dashboard) 查看使用情况。

### Q2: 免费配额用完了怎么办？
**A**:
1. 增加缓存时长到 300 秒
2. 减少支持的加密货币数量（修改 `coinapi.ts` 中的 symbols 数组）
3. 升级到付费套餐

### Q3: 为什么有些数据是估算值？
**A**: 为了节省 API 配额。市值和交易量需要额外的 API 调用。如果配额充足，可以修改代码获取真实值。

### Q4: 如何获取 100% 真实的所有数据？
**A**: 需要调用更多 API 端点：
- 市值: `/v1/assets/{asset_id}`
- 交易量: `/v1/metrics/exchange/current`
- 24h涨跌: `/v1/exchangerate/{symbol}/USD/history`

**注意**: 这会显著增加 API 调用次数（每次加载主页可能需要 20+ 次调用）。

### Q5: 可以使用其他交易所的数据吗？
**A**: 可以！修改 `coinapi.ts` 中的 `symbolId`:
```typescript
// 默认使用 Bitstamp
const symbolId = `BITSTAMP_SPOT_${symbol}_USD`;

// 改为 Coinbase
const symbolId = `COINBASE_SPOT_${symbol}_USD`;

// 改为 Binance
const symbolId = `BINANCE_SPOT_${symbol}_USDT`;
```

---

## 📝 测试 API 连接

### 快速测试
```bash
# 启动开发服务器
npm run dev

# 在浏览器访问
http://localhost:3000

# 查看控制台输出
# 应该看到成功的 API 调用日志
```

### 手动测试 API
```bash
# 替换为你的 API Key
curl -H "X-CoinAPI-Key: YOUR_API_KEY" \
  "https://rest.coinapi.io/v1/exchangerate/BTC/USD"
```

成功响应：
```json
{
  "time": "2025-11-06T12:00:00.0000000Z",
  "asset_id_base": "BTC",
  "asset_id_quote": "USD",
  "rate": 45234.56
}
```

---

## 🎉 总结

✅ **已实现**:
- 真实的实时价格（6个加密货币）
- 真实的 30 天 OHLCV 历史数据
- 智能缓存（减少 80-90% API 调用）
- 速率限制保护
- 多交易所备用方案

⚠️ **需要注意**:
- 市值和交易量是估算值（可配置为真实）
- 免费配额有限（100次/天）
- 必须配置 API Key

**推荐配置**: 使用 120 秒缓存，可在免费配额下支持中等访问量。

---

**更新日期**: 2025-11-06
**版本**: 2.0 - Real API Integration
