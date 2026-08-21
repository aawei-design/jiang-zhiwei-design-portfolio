import { useMemo, useState } from 'react'
import Masonry from './Masonry.jsx'
import './masonry-portfolio.css'

const GROUPS = [
  {
    name: '营销视觉',
    code: 'CAMPAIGN',
    items: [
      ['vip-cover.webp', '小米影视 VIP 周末活动', 460],
      ['vip-green-final.webp', '周末剧给力', 470],
      ['vip-mifan.webp', '2026 米粉节', 540],
      ['vip-618-master.webp', '618 囤年卡主视觉', 500],
      ['vip-618-benefit.webp', '618 会员权益', 470],
      ['vip-618-social.webp', '618 社交媒体延展', 540],
      ['vip-618-program.webp', '618 节目推荐', 620],
      ['vip-618-stage1.webp', '618 阶段一', 430],
      ['vip-618-stage2.webp', '618 阶段二', 430],
      ['vip-618-stage3.webp', '618 阶段三', 430],
      ['vip-promo-may-card.webp', '五月会员日宣发', 600],
      ['vip-promo-may-intro.webp', '五月宣发视觉', 500],
      ['vip-promo-may-banner.webp', '五月动态 Banner', 400],
      ['vip-promo-618-intro.webp', '618 宣发视觉', 500],
      ['vip-promo-618-stage3-intro.webp', '618 冲刺视觉', 500],
      ['vip-promo-618-banner.webp', '618 动态 Banner', 400],
      ['vip-promo-xhs-618-1.webp', '小红书 618 物料 01', 650],
      ['vip-promo-xhs-618-2.webp', '小红书 618 物料 02', 650],
      ['vip-archive-memberday-april.webp', '四月影视会员日', 650],
      ['vip-archive-memberday-july.webp', '七月影视会员日', 650],
      ['vip-archive-memberday-april-banner.webp', '会员日动态条幅', 390],
      ['vip-archive-memberday-banner.webp', '影视会员动态条幅', 390],
      ['vip-archive-xhs-movie.webp', '小红书电影内容', 650],
      ['vip-archive-xhs-tv.webp', '小红书剧集内容', 650],
      ['vip-archive-xhs-variety.webp', '小红书综艺内容', 650],
      ['vip-mifan-long-full.png', '米粉节完整长图', 760],
      ['vip-archive-heat-ranking.png', '小米电视热度榜长图', 760],
    ],
  },
  {
    name: 'IP 体系',
    code: 'MIHOME IP',
    items: [
      ['mihome-cover.webp', 'Mihome IP 主形象', 520],
      ['mihome-family.webp', 'Mihome 家族形象', 520],
      ['mihome-scenes.webp', 'Mihome 场景化延展', 520],
      ['mihome-system.webp', 'Mihome 视觉系统', 460],
      ['mihome-newyear.webp', 'Mihome 新年应用', 600],
      ['mihome-cny-phase2.webp', '春节活动第二阶段', 520],
      ['mihome-cny-phase3.webp', '春节活动第三阶段', 520],
      ['mihome-activity-01.webp', '活动页视觉 01', 480],
      ['mihome-activity-02.webp', '活动页视觉 02', 480],
      ['mihome-activity-03.webp', '活动页视觉 03', 480],
      ['mihome-activity-04.webp', '活动页视觉 04', 480],
      ['mihome-activity-05.webp', '活动页视觉 05', 480],
      ['mihome-buy-01.webp', '购买页视觉 01', 480],
      ['mihome-buy-02.webp', '购买页觉 02', 480],
      ['mihome-buy-03.webp', '购买页觉 03', 480],
      ['mihome-buy-04.webp', '购买页觉 04', 480],
      ['mihome-buy-05.webp', '购买页觉 05', 480],
      ['mihome-buy-06.webp', '购买页觉 06', 480],
    ],
  },
  {
    name: '电商专题',
    code: '11.11 / JD',
    items: [
      ['jd-browser.png', '京东活动浏览器场景', 470],
      ['jd-search-main.png', '搜索主视觉', 420],
      ['jd-search-card.png', '搜索卡片视觉', 520],
      ['jd-content-main.png', '内容主入口', 470],
      ['jd-content-03.png', '内容入口 03', 450],
      ['jd-content-04.png', '内容入口 04', 450],
      ['jd-content-05.png', '内容入口 05', 450],
      ['jd-content-06.png', '内容入口 06', 450],
      ['jd-negative-wide.png', '负一屏宽屏延展', 390],
      ['jd-negative-01.png', '负一屏延展 01', 420],
      ['jd-negative-02.png', '负一屏延展 02', 420],
      ['jd-negative-03.png', '负一屏延展 03', 420],
      ['jd-negative-04.png', '负一屏延展 04', 420],
      ['jd-negative-05.png', '负一屏延展 05', 420],
      ['jd-negative-06.png', '负一屏延展 06', 420],
    ],
  },
  {
    name: 'AI 工具',
    code: 'AI + DESIGN',
    items: [
      ['ai-component-replace.webp', '组件替换小助手', 500],
      ['ai-tool-home.webp', 'AI 工具首页', 540],
      ['ai-tool-layout.webp', 'AI 版式生成', 540],
      ['ai-tool-demo.webp', 'AI 工具演示', 520],
      ['ai-tool-export.webp', 'AI 工具导出', 480],
    ],
  },
  {
    name: '动态设计',
    code: 'MOTION',
    folder: 'motion/',
    items: [
      ['tv-harry-winston.mp4', 'HARRY WINSTON 创意开机', 430, 'video'],
      ['tv-skechers.mp4', '斯凯奇创意开机', 430, 'video'],
      ['tv-minutemaid.mp4', '美汁源大视界', 430, 'video'],
      ['tv-burger.mp4', '超霸牛堡 OTT 大视界', 430, 'video'],
      ['tv-canon-film.mp4', '佳能创意开机', 430, 'video'],
      ['tv-canon-logo.mp4', '佳能品牌标识动效', 430, 'video'],
      ['tv-coke.mp4', '可口可乐大屏动效', 430, 'video'],
      ['tv-crunchy-rice.mp4', '脆米锅巴大屏动效', 430, 'video'],
      ['tv-kfc.mp4', 'KFC 创意开机', 430, 'video'],
      ['tv-mead-johnson.mp4', '美赞臣品牌动效', 430, 'video'],
      ['tv-wahaha.mp4', '娃哈哈品牌动效', 430, 'video'],
      ['mobile-airchina.mp4', '国航手机端开屏', 720, 'video'],
      ['mobile-canon.mp4', '佳能手机端开屏', 720, 'video'],
      ['mobile-rain.mp4', '下雨环境动效', 720, 'video'],
      ['mobile-wind.mp4', '大风环境动效', 720, 'video'],
      ['mobile-tongcheng.mp4', '同程手机端开屏', 720, 'video'],
      ['practice-blender.mp4', 'Blender 个人练习', 520, 'video'],
      ['practice-asean.mp4', 'ASEAN 个人练习', 520, 'video'],
      ['practice-huawei.mp4', '华为个人练习', 520, 'video'],
    ],
  },
]

const ALL_ITEMS = GROUPS.flatMap((group) => group.items.map(([file, title, height, media], index) => ({
  id: `${group.code}-${String(index + 1).padStart(2, '0')}`,
  title,
  group: group.code,
  height,
  media: media || 'image',
  src: `/portfolio/${group.folder || ''}${file}`,
})))

export default function MasonryPortfolio() {
  const [filter, setFilter] = useState('全部')
  const items = useMemo(() => filter === '全部' ? ALL_ITEMS : ALL_ITEMS.filter((item) => item.group === filter), [filter])

  return (
    <section className="masonry-portfolio" aria-label="Masonry 作品墙">
      <div className="masonry-intro">
        <span>REACT BITS / MASONRY</span>
        <p>图片、长图、动态横幅与视频以同一套流式规则编排。点击作品可查看原始文件。</p>
        <b>{String(items.length).padStart(2, '0')} ITEMS</b>
      </div>
      <div className="masonry-filters" aria-label="筛选作品类别">
        {['全部', ...GROUPS.map((group) => group.code)].map((name) => (
          <button key={name} className={filter === name ? 'is-active' : ''} type="button" onClick={() => setFilter(name)}>{name}</button>
        ))}
      </div>
      <Masonry
        items={items}
        ease="elastic.out(1, 0.75)"
        duration={0.9}
        stagger={0.025}
        animateFrom="bottom"
        scaleOnHover
        hoverScale={0.97}
        blurToFocus
        colorShiftOnHover
      />
    </section>
  )
}
