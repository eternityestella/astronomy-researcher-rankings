# 全球天文研究者排名

一个可离线使用的静态天文研究者名录，支持姓名及机构搜索、研究方向与国家或地区筛选、分项排序、分页和研究者详情。

在线地址：<https://eternityestella.github.io/astronomy-researcher-rankings/>

## 本地查看

直接用现代浏览器打开 `index.html`，或在本目录启动静态服务器：

```sh
python3 -m http.server 8000
```

然后访问 <http://localhost:8000>。页面数据随仓库提供；查看外部论文及来源链接需要联网。无需安装依赖或执行构建。

## 文件

| 文件 | 用途 |
| --- | --- |
| `index.html` | 页面入口 |
| `styles.css` | 桌面和移动端样式 |
| `app.js` | 搜索、筛选、排序、分页及详情交互 |
| `data.js` | 研究者记录、分项得分和评分方法 |
| `topics.js` | 研究方向分类及论文依据 |
| `.nojekyll` | 让 GitHub Pages 直接发布静态文件 |

## 数据与评分

数据快照为 **2026-11-24**，包含 **14,631** 条记录。其中 **12,127** 条有计分证据，**2,504** 条零证据分并列；研究方向数据覆盖 **10,194** 条记录。

原始说明标注，排名数据来自 `Worldwide_Astronomy_Researchers.xlsx` 的「全员学术影响排名」和「评分标准与覆盖」工作表；原始工作簿未包含在本仓库中。当前仓库保存用于展示的静态数据，不包含数据采集或评分重算脚本。

评分权重为本次排名设定。论文发表窗口截至 2025 年，奖项含已公开的 2026 年结果。完整评分规则、作者匹配方法和覆盖说明可在网页右上角「评分方法」中查看；研究者详情包含对应证据与来源链接。零证据分表示缺少可归属的计分记录。

## GitHub Pages 发布

仓库：<https://github.com/eternityestella/astronomy-researcher-rankings>

在仓库 **Settings → Pages** 中选择 **Deploy from a branch**，使用 **main** 分支的 **/ (root)**。后续将页面或数据更新推送到 `main` 即会触发发布。
