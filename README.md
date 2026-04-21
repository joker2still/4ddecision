# 4DDecision

4DDecision 是一个围绕“过去、现在、未来”三个时间维度来辅助个人做决定的项目。

它的目标不是替代人的判断，也不是给出某种“绝对正确”的答案，而是帮助使用者在犹豫、拉扯、反复自我否定的时候，把内在的冲突整理清楚，让一个人更有机会做出一个更忠于自己的决定。

这个项目的理想，不是让人做出“长期收益最大化”的选择，而是帮助人更接近真实的自我，重新感受到自己的初心、愿望和生命力。在这个意义上，4DDecision 更像一个帮助人“be self”的工具，而不是一个传统意义上的理性优化器。

## Project Philosophy

4DDecision 的核心思想可以概括为一句话：

**让过去、现在、未来的自己，一起参与一次决策。**

它试图把一个人在做决定时最常见的三种声音，放进同一个界面里：
- 过去的我：我之前是否认真打算过做这件事
- 现在的我：此刻我想做这件事的意愿有多强烈
- 未来的我：长期来看，我会不会感谢自己现在做了这件事

这个结构的意义，不是让某一个“我”压倒另外两个“我”，而是让一个人看清自己真正的犹豫到底在哪里。

因此，这个产品强调的不是：
- 替用户决定“正确答案”
- 用算法告诉用户“你应该怎么做”
- 追求一种标准化的人生最优解

它更强调的是：
- 帮用户看清自己到底在纠结什么
- 帮用户分辨初心、当下渴望和未来想象之间的关系
- 在高压和外部标准之下，重新唤醒个人的生命力

换句话说，4DDecision 更像一面镜子，而不是一个裁判。

## What The Product Tries To Solve

很多决定之所以难，不是因为信息不够，而是因为人的内心往往被不同时间维度的自己拉扯：
- 过去的自己可能早就有某种初心或承诺
- 现在的自己可能很想做，也可能非常抗拒
- 未来的自己可能会感激今天，也可能会后悔今天

4DDecision 想解决的，不是“怎么让人更会算”，而是“怎么让人更会听见自己”。

它尤其适合处理这类问题：
- 我要不要开始做一件一直想做的事
- 我要不要放弃一个并不适合自己的方向
- 我要不要在理性、安全、快乐、热情之间重新排序
- 我要不要做一个未必最优、但更忠于自己的决定

## Current Scope

当前项目已经拆分为前后端两个子项目：
- `frontend`：基于 Vite + React，负责页面交互、语言切换、人格类型选择、本地结果缓存和接口调用
- `backend`：基于 FastAPI，负责接收前端输入并返回决策结果

目前的产品流程包括：
- 首页：展示项目定位，并允许用户预先选择自己的决策倾向
- 评估页：围绕过去、现在、未来三个维度输入分数
- 结果页：展示结果、结果说明，以及对三个维度的详细解释

## Product Positioning

这个项目不是一个“替你做决定”的网站，而是一个“帮助你把决定表达清楚”的网站。

它更适合作为一个持续迭代的个人决策辅助原型。它的价值不在于自动化决策，而在于帮助用户：
- 让想法有结构
- 让犹豫能被命名
- 让过去、现在、未来的自己进入同一个对话
- 让一个人重新回到“我真正想成为什么样的人”

未来如果继续扩展，它可以自然延伸到更多场景，例如：
- 个人行动选择
- 长短期目标取舍
- 习惯建立与延迟满足
- 以时间视角组织的自我反思工具

## Tech Stack

- Frontend: React 18, React Router, Vite
- Backend: FastAPI, Pydantic
- Storage:
  - 前端通过 `localStorage` 保存最近一次结果和人格偏好
  - 后端当前不依赖数据库

## Directory Structure

```text
4ddecision/
├─ frontend/
│  ├─ public/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ constants/
│  │  ├─ contexts/
│  │  ├─ pages/
│  │  ├─ services/
│  │  └─ utils/
│  ├─ .env.example
│  ├─ index.html
│  ├─ package.json
│  └─ vite.config.js
├─ backend/
│  ├─ app/
│  │  └─ main.py
│  ├─ requirements.txt
│  └─ README.md
└─ README.md
```

## Getting Started

### 1. Start the backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend default address:
- `http://127.0.0.1:8000`

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend default address:
- `http://127.0.0.1:5173`

## Frontend-Backend Interaction

页面启动后，前端会调用基础接口检查服务状态：
- `GET /api/health`
- `GET /api/hello`

用户在评估页提交后，前端会向后端发送决策评分请求：
- `POST /api/decision-score`

## User Experience Notes

- 默认语言为中文，可在页面中切换中英文
- 人格类型在首页选择，并会在评估页中显示当前选择结果
- 支持百分制与十分制两种输入方式；十分制会在前端换算后再提交给后端
- 结果页不会直接向用户暴露内部权重，而是展示更可理解的说明内容

## Notes

本 README 重点描述项目定位、产品思路和当前能力，不展开模型设计与算法细节。
