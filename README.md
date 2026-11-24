# 全球天文研究者排名

一个基于公开学术证据的天文研究者名录与排名网站。按长期成果、近期影响、研究产出、奖项与独立发现综合计分，支持查看分项得分、论文依据及来源链接。

**[访问在线网站](https://eternityestella.github.io/astronomy-researcher-rankings/)** · **[查看项目仓库](https://github.com/eternityestella/astronomy-researcher-rankings)**

网站使用 HTML、CSS 和原生 JavaScript，数据随仓库提供，可在本地离线搜索和浏览。

## 功能

- **搜索研究者**：支持中文名、英文名及机构名称，多个关键词可用空格组合。
- **组合筛选**：按研究方向、国家或地区、证据状态筛选，也可点击分类标签快速浏览。
- **排序与分页**：按名次、姓名、综合分或分项得分排序，支持每页 25、50、100 条及页码跳转。
- **查看个人详情**：点击姓名查看机构、证据状态、分项得分、代表作品、方向分类依据及公开来源。
- **查阅评分方法**：页面右上角提供权重、公式、作者匹配规则和数据覆盖说明。
- **移动端浏览**：窄屏优先展示姓名、机构、主要方向和综合分，分项信息可在个人详情中查看。

## 数据快照

当前快照日期：**2026-11-24**。以下数量均为本仓库随附数据的记录数。

| 指标 | 数量 |
| --- | ---: |
| 全部名录记录 | 14,631 |
| 有计分证据的记录 | 12,127 |
| 零证据分并列记录 | 2,504 |
| 有研究方向分类的记录 | 10,194 |
| 研究方向证据不足的记录 | 4,437 |

论文发表窗口截至 **2025 年**；奖项包含已公开的 **2026 年**结果。Crossref 被引数采用检索时快照，可能包含 2026 年引用；Scopus 指标采用随附方法说明中的去自引版本。

### 数据来源

原始说明标注，排名数据来自 `Worldwide_Astronomy_Researchers.xlsx` 的「全员学术影响排名」和「评分标准与覆盖」工作表。本仓库保存展示所需的静态数据，原始工作簿及数据采集、评分重算脚本需另行管理。

随附方法说明列出的主要证据来源包括：

| 来源 | 用途与覆盖 |
| --- | --- |
| [Crossref](https://api.crossref.org/) | 20 种期刊的可用年份切片，2006–2025 年共 116,169 条按 DOI 去重的作品记录 |
| [arXiv 元数据集](https://www.kaggle.com/datasets/Cornell-University/arxiv) | 1992–2025 年 astro-ph 分类及交叉投递，共 375,801 条作品记录 |
| [Ioannidis / Elsevier 引文数据库，第 9 版](https://doi.org/10.17632/btchxktzyw.9) | Scopus 生涯及 2025 年单年 c-score 等引文指标 |
| 奖项机构、研究机构及其他公开来源 | 核对机构身份、奖项与独立发现；逐人出处见网页详情 |

上表中的文献数量描述原始证据样本的覆盖，个人匹配结果以网页详情为准。

## 评分与分类口径

### 综合评分

总分为 **100 分**，由四项相加：

| 评分项 | 上限 | 组成 |
| --- | ---: | --- |
| 长期成果与影响 | 35 | Crossref 标准化被引贡献 20 分、Scopus 生涯 c-score 10 分、匹配作品数 5 分 |
| 近期学术影响 | 35 | 2021–2025 年发表论文的 Crossref 标准化被引贡献 22 分、Scopus 2025 年 c-score 13 分 |
| 近期研究产出 | 15 | 2021–2025 年论文与预印本，按每篇 `1 / √作者人数` 累加，并在同一人名下按 DOI 去重 |
| 奖项与独立发现 | 15 | 按有公开依据的奖项或发现分档计分，每人取最高一项 |

引文贡献、作品数和折算产出采用对数换算，Scopus c-score 采用线性换算，各子项截断在对应上限。具体阈值、引文标准化方式及奖项分档见网页「评分方法」。

得分相同采用竞赛排名，例如 `1、2、2、4`。缺少可归属的计分记录时，该项记为 **0 证据分**；零证据分并列表示现有证据缺失。个人详情另列仅按前三项计算的文献分名次，便于查看奖项权重的影响。

### 研究方向与地区

- **分类窗口**：2016–2025 年至少有 3 篇可分大类的论文时，使用这 10 年的记录；其余使用 1992–2025 年记录。
- **6 个学科大类**：按论文首个 astro-ph 子分类统计；一个大类需至少 2 篇，并占该作者可分大类作品的至少 20%。
- **12 个专题方向**：按论文标题中的主题关键词识别，每个专题需至少 2 篇匹配论文。
- **多标签**：同一记录可属于多个方向，各分类计数可以重叠；具体论文依据可在个人详情中查看。
- **国家或地区**：沿用名录中的机构、引文库地区或 IAU 归属字段，并统一常见名称写法；一条记录可匹配多个地区。

### 解释与覆盖

权重由本项目设定，数值用于本样本的公开证据排序。期刊、年份、学科及地区覆盖存在差异，姓名匹配也可能受到同名、异名、缺失 ORCID 等因素影响。仪器建设、团队贡献和早期职业研究者的成果可能难以充分反映；比较个别研究者时，应结合分项得分、证据状态和原始来源。

## 本地运行

下载仓库后，可以直接用现代浏览器打开 `index.html`。也可以使用 Git 克隆并启动本地静态服务器：

```sh
git clone https://github.com/eternityestella/astronomy-researcher-rankings.git
cd astronomy-researcher-rankings
python3 -m http.server 8000
```

访问 <http://localhost:8000>。

页面需要启用 JavaScript，无需安装前端依赖或执行构建。浏览内置数据可离线完成；打开外部论文及来源链接需要联网。

## 项目结构

```text
astronomy-researcher-rankings/
├── index.html     # 页面入口
├── styles.css     # 桌面和移动端样式
├── app.js         # 搜索、筛选、排序、分页及详情交互
├── data.js        # 研究者记录、分项得分及评分方法
├── topics.js      # 研究方向分类、统计及论文依据
├── README.md      # 项目说明
├── README.txt     # 随原始文件包提供的简要说明
├── .gitignore     # 忽略本地系统文件及日志
└── .nojekyll      # GitHub Pages 静态文件发布标记
```

## 更新与发布

当前使用 **GitHub Pages** 托管，发布来源为 **`main` 分支的 `/ (root)`**。对应设置位于仓库 **Settings → Pages → Deploy from a branch**。

修改页面或数据后，提交并推送到 `main`：

```sh
git add README.md index.html styles.css app.js data.js topics.js
git commit -m "Update astronomy researcher rankings"
git push origin main
```

GitHub 会自动构建并发布，可在 [Actions](https://github.com/eternityestella/astronomy-researcher-rankings/actions) 查看部署结果。

更新数据时，请同步核对：

1. 保持 `data.js` 的 `window.ASTRONOMY` 和 `topics.js` 的 `window.ASTRONOMY_TOPICS` 结构与页面代码一致。
2. 研究方向记录以原名录行号关联，核对 `data.js` 每行第 14 列（索引 `13`）与 `topics.js` 的记录键。
3. 同步更新数据快照日期、评分方法、覆盖统计和本 README 中的数量。
4. 本地检查搜索、组合筛选、排序、分页、个人详情及评分方法弹窗。

可用 Node.js 快速检查 JavaScript 语法：

```sh
node --check app.js
node --check data.js
node --check topics.js
```

## 纠错与反馈

欢迎通过 [Issues](https://github.com/eternityestella/astronomy-researcher-rankings/issues) 提交姓名、机构、论文归属、研究方向或奖项记录的更正。请附研究者姓名、对应记录信息和可核查的公开来源，便于复核。
