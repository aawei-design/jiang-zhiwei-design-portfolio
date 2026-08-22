import { useEffect, useRef, useState } from 'react'
import ProfileCard from './ProfileCard.jsx'
import ReliableVideo from './ReliableVideo.jsx'

const Arrow = ({ diagonal = false }) => (
  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
    {diagonal ? <path d="M6 18 18 6M8 6h10v10" /> : <path d="M5 12h14M14 7l5 5-5 5" />}
  </svg>
)

const mediaHintCopy = {
  image: '点击图片可放大查看',
  video: '点击视频可放大查看',
  both: '点击图片和视频可放大查看',
}

const MediaViewHint = ({ kind = 'image', className = '' }) => (
  <p className={`project-media-hint ${className}`.trim()}>
    <span aria-hidden="true">⤢</span>
    {mediaHintCopy[kind]}
  </p>
)

const heroTileSources = [
  '/previews/hero/weekend-cinema.webp.webp',
  '/previews/hero/618-stage2.webp.webp',
  '/previews/hero/weekend-year.webp.webp',
  '/previews/hero/618-buy.webp.webp',
  '/previews/hero/weekend-lottery.webp.webp',
  '/previews/hero/618-stage3.webp.webp',
  '/previews/hero/weekend-purple.webp.webp',
  '/previews/hero/618-content.webp.webp',
  '/previews/hero/weekend-vip.webp.webp',
  '/previews/hero/618-final.webp.webp',
  '/previews/hero/618-benefit.webp.webp',
  '/previews/hero/618-coupon.webp.webp',
  '/previews/hero/618-stage3-small.webp.webp',
  '/previews/hero/618-stage4.webp.webp',
  '/previews/hero/618-countdown.webp.webp',
  '/previews/hero/weekend-content.webp.webp',
  '/previews/hero/weekend-premium.webp.webp',
  '/previews/hero/weekend-lottery-last.webp.webp',
  '/previews/hero/weekend-gift-last.webp.webp',
  '/previews/hero/weekend-purple-last.webp.webp',
]

const heroStillSources = [
  '/previews/hero-still/weekend-cinema.webp',
  '/previews/hero-still/618-stage2.webp',
  '/previews/hero-still/weekend-year.webp',
  '/previews/hero-still/618-buy.webp',
  '/previews/hero-still/weekend-lottery.webp',
  '/previews/hero-still/618-stage3.webp',
  '/previews/hero-still/weekend-purple.webp',
  '/previews/hero-still/618-content.webp',
  '/previews/hero-still/weekend-vip.webp',
  '/previews/hero-still/618-final.webp',
  '/previews/hero-still/618-benefit.webp',
  '/previews/hero-still/618-coupon.webp',
  '/previews/hero-still/618-stage3-small.webp',
  '/previews/hero-still/618-stage4.webp',
  '/previews/hero-still/618-countdown.webp',
  '/previews/hero-still/weekend-content.webp',
  '/previews/hero-still/weekend-premium.webp',
  '/previews/hero-still/weekend-lottery-last.webp',
  '/previews/hero-still/weekend-gift-last.webp',
  '/previews/hero-still/weekend-purple-last.webp',
]

const heroTiles = heroTileSources.map((animated, index) => ({
  animated,
  still: heroStillSources[index],
}))

const projects = [
  {
    id: '01',
    mobileTitle: '宣发营销',
    type: 'BRAND CAMPAIGN / 2026',
    title: '小米影视VIP 宣发与重点营销',
    desc: '从新媒体宣发到春节、618 大促，建立多渠道整合视觉。',
    asset: '/portfolio/vip-promo-may-card.webp',
    href: '#case-vip',
    className: 'project-card project-card--wide',
  },
  {
    id: '02',
    mobileTitle: '动态视觉',
    type: 'MOTION / OTT + APP / 2025',
    title: '小米电视与手机 App 动态视觉',
    desc: '覆盖 OTT 活动入口、创意开机、动态开屏与浮层广告。',
    asset: '/hero/618-content.webp',
    href: '#case-motion',
    className: 'project-card',
  },
  {
    id: '03',
    mobileTitle: 'Mihome IP',
    type: 'IP DESIGN / 2026',
    title: 'Mihome IP 形象与视觉体系',
    desc: '从形象设定到营销场景，打造可持续生长的品牌视觉资产。',
    asset: '/portfolio/mihome-cover.webp',
    href: '#case-mihome',
    className: 'project-card',
  },
  {
    id: '04',
    mobileTitle: 'AI 工具',
    type: 'AI TOOL / FIGMA PLUGIN / 2026',
    title: 'AI 组件替换助手',
    desc: '将 Claude + Codex 的探索落成 Figma 插件，服务真实视觉生产。',
    asset: '/portfolio/ai-component-replace.webp',
    href: '#case-ai',
    className: 'project-card project-card--wide project-card--ai',
  },
]

const caseIds = projects.map((project) => project.href.slice(1))

function currentCaseId() {
  if (typeof window === 'undefined') return caseIds[0]
  const hash = decodeURIComponent(window.location.hash.slice(1))
  return caseIds.includes(hash) ? hash : caseIds[0]
}

const capabilities = [
  { no: '01', en: 'VISUAL DESIGN', title: '视觉塑造', text: '从核心概念、主视觉到延展物料，建立一致且有记忆点的视觉语言。', href: '#case-vip' },
  { no: '02', en: 'CAMPAIGN', title: '整合营销设计', text: '兼顾品牌质感与业务目标，完成从线上触点到线下场景的系统化设计。', href: '#case-vip' },
  { no: '03', en: 'MOTION & 3D', title: '动态与三维表达', text: '以动态叙事和空间感知强化品牌体验，兼容移动端与 OTT 大屏场景。', href: '#case-motion' },
  { no: '04', en: 'AI + DESIGN', title: 'AI 设计工程化', text: '用 Claude、Codex 与生成式工具解决高频设计任务，让创意稳定落地。', href: '#case-ai' },
]

const archiveItems = [
  { no: 'A01', title: '米粉节活动', type: '长图宣发', asset: '/portfolio/vip-mifan-long-full.png', long: true },
  { no: 'A02', title: '小米电视热度榜', type: '长图宣发', asset: '/portfolio/vip-archive-heat-ranking.png', long: true },
  { no: 'A03', title: '影视会员日-小红书', type: '社媒视觉', asset: '/portfolio/vip-archive-memberday-april.webp' },
  { no: 'A04', title: '影视会员日-小红书', type: '社媒视觉', asset: '/portfolio/vip-archive-memberday-july.webp' },
  { no: 'A05', title: '影视会员日-公众号 Banner', type: '动态 Banner', asset: '/portfolio/vip-archive-memberday-april-banner.webp' },
  { no: 'A06', title: '影视会员日-公众号 Banner', type: '动态 Banner', asset: '/portfolio/vip-archive-memberday-banner.webp' },
  { no: 'A10', title: 'HARRY WINSTON 创意开机', type: '电视端动态', asset: '/portfolio/motion/tv-harry-winston.mp4', media: 'video' },
  { no: 'A11', title: '斯凯奇创意开机', type: '电视端动态', asset: '/portfolio/motion/tv-skechers.mp4', media: 'video' },
  { no: 'A12', title: '美汁源大视界', type: '电视端动态', asset: '/portfolio/motion/tv-minutemaid.mp4', media: 'video' },
  { no: 'A13', title: '超霸牛堡 OTT 大视界', type: '电视端动态', asset: '/portfolio/motion/tv-burger.mp4', media: 'video' },
  { no: 'A07', title: '个人练习', type: '动态练习', asset: '/portfolio/motion/practice-blender.mp4', media: 'video' },
  { no: 'A08', title: '个人练习', type: '动态练习', asset: '/portfolio/motion/practice-asean.mp4', media: 'video' },
  { no: 'A09', title: '个人练习', type: '动态练习', asset: '/portfolio/motion/practice-huawei.mp4', media: 'video' },
]

function Visual({ type }) {
  if (type === 'spring') return (
    <div className="visual visual--spring" aria-label="米影视春节整合营销概念图">
      <div className="spring-orbit spring-orbit--one" />
      <div className="spring-orbit spring-orbit--two" />
      <div className="spring-copy"><span>618</span><b>春日好剧放送</b></div>
      <div className="glass glass--poster"><small>XIAOMI TV</small><strong>心动开播</strong><i>VIP / 2026</i></div>
      <div className="glass glass--phone"><div /><div /><div /></div>
    </div>
  )
  if (type === 'mihome') return (
    <div className="visual visual--mihome" aria-label="Mihome IP 形象概念图">
      <div className="mihome-noise" />
      <div className="mascot"><i /><i /><span>mi</span></div>
      <div className="mihome-word">MIHOME<small>MAKE LIFE FEEL CLOSER.</small></div>
    </div>
  )
  if (type === 'motion') return (
    <div className="visual visual--motion" aria-label="小米电视创意开机概念图">
      <div className="motion-screen">
        <span className="motion-logo">mi</span>
        <div className="motion-wave motion-wave--1" /><div className="motion-wave motion-wave--2" /><div className="motion-wave motion-wave--3" />
      </div>
      <span className="motion-caption">OTT MOTION SYSTEM</span>
    </div>
  )
  return (
    <div className="visual visual--ai" aria-label="AI 视觉生产流程概念图">
      <div className="ai-grid" />
      <div className="ai-title"><small>DESIGN AUTOMATION</small><strong>50<sup>%+</sup></strong><span>EFFICIENCY</span></div>
      <div className="ai-node ai-node--one">FIGMA</div><div className="ai-node ai-node--two">CODEX</div><div className="ai-node ai-node--three">CLAUDE</div>
    </div>
  )
}

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible'))
    }, { threshold: 0.12 })
    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])
}

function App({ enhancedNav = false, enhancedProfile = false, enhancedContent = false }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isNavFloating, setIsNavFloating] = useState(false)
  const [mobileCase, setMobileCase] = useState(currentCaseId)
  const glowRef = useRef(null)
  useReveal()

  useEffect(() => {
    const moveGlow = (event) => {
      if (!glowRef.current) return
      glowRef.current.style.setProperty('--x', `${event.clientX}px`)
      glowRef.current.style.setProperty('--y', `${event.clientY}px`)
    }
    window.addEventListener('pointermove', moveGlow)
    return () => window.removeEventListener('pointermove', moveGlow)
  }, [])

  useEffect(() => {
    const syncCaseFromHash = () => {
      const nextCase = currentCaseId()
      setMobileCase(nextCase)
      if (!caseIds.includes(decodeURIComponent(window.location.hash.slice(1)))) return
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => document.getElementById(nextCase)?.scrollIntoView())
      })
    }

    window.addEventListener('hashchange', syncCaseFromHash)
    return () => window.removeEventListener('hashchange', syncCaseFromHash)
  }, [])

  const selectMobileCase = (caseId) => {
    setMobileCase(caseId)
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${caseId}`)
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => document.getElementById(caseId)?.scrollIntoView())
    })
  }

  useEffect(() => {
    const updateNavigation = () => {
      setIsNavFloating(window.scrollY >= window.innerHeight - 96)
    }
    updateNavigation()
    window.addEventListener('scroll', updateNavigation, { passive: true })
    window.addEventListener('resize', updateNavigation)
    return () => {
      window.removeEventListener('scroll', updateNavigation)
      window.removeEventListener('resize', updateNavigation)
    }
  }, [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('2523921625@qq.com')
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = 'mailto:2523921625@qq.com'
    }
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="site" ref={glowRef}>
      <div className="cursor-glow" />
      <header className={isNavFloating ? 'nav-shell is-floating' : 'nav-shell'}>
        <a className="brand" href="#top" aria-label="返回首页"><span>J</span><b>蒋志伟作品集</b></a>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="打开导航">
          <span /><span />
        </button>
        <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'}>
          <a href="#about" onClick={closeMenu}>经历 <span>ABOUT</span></a>
          {enhancedNav ? (
            <div className="nav-project-group">
              <a className="nav-project-trigger" href="#work" onClick={closeMenu} aria-haspopup="true">项目 <span>WORK</span></a>
              <div className="nav-project-submenu" aria-label="选择项目">
                {projects.map((project) => (
                  <a key={project.id} href={project.href} onClick={closeMenu} aria-label={`${project.id} ${project.title}`}>{project.id}</a>
                ))}
              </div>
            </div>
          ) : <a href="#work" onClick={closeMenu}>项目 <span>WORK</span></a>}
          <a href="#strength" onClick={closeMenu}>能力 <span>STRENGTH</span></a>
        </nav>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-mosaic" aria-hidden="true">
            {heroTiles.map((tile, index) => (
              <figure className="hero-tile" key={`${tile.animated}-${index}`} style={{ '--tile-image': `url(${tile.still})` }}>
                <img src={tile.animated} alt="" loading="eager" decoding="async" fetchPriority={index < 5 ? 'high' : 'low'} />
              </figure>
            ))}
          </div>
          <div className="hero-blue-wash" />
          <div className="hero-noise" />
          <div className="hero-grid" />
          <div className="hero-content frame">
            <div className="hero-showcase">
              <div className="hero-title-panel">
                <div className="hero-panel-meta"><span>JIANG ZHIWEI</span><span>{enhancedContent ? 'VISUAL DESIGNER' : 'VISUAL DESIGNER · BEIJING'}</span></div>
                <h1><small>JZ'S PORTFOLIO</small><span>视觉设计</span><span>作品集</span></h1>
                <div className="hero-panel-bottom"><span>视觉营销 · 动态设计 · IP 系统 · AI 工具开发</span><b>2025—2026</b></div>
              </div>
              <aside className="hero-skill-panel" aria-label="设计软件">
                <div className="hero-software-head"><span>DESIGN TOOLKIT</span><small>设计工具</small></div>
                <div className="hero-software-grid">
                  <div className="software-logo software-logo--figma" aria-label="Figma">
                    <img src="/logos/figma.svg" alt="Figma Logo" />
                    <small>FIGMA</small>
                  </div>
                  <div className="software-logo software-logo--ps" aria-label="Adobe Photoshop"><img src="/logos/photoshop.svg" alt="Adobe Photoshop Logo" /><small>PHOTOSHOP</small></div>
                  <div className="software-logo software-logo--ai" aria-label="Adobe Illustrator"><img src="/logos/illustrator.svg" alt="Adobe Illustrator Logo" /><small>ILLUSTRATOR</small></div>
                  <div className="software-logo software-logo--ae" aria-label="Adobe After Effects"><img src="/logos/aftereffects.svg" alt="Adobe After Effects Logo" /><small>AFTER EFFECTS</small></div>
                </div>
                <div className="hero-software-foot">视觉设计 / 动态制作 / 原型协作</div>
              </aside>
            </div>
            <div className="hero-foot">
              <p>我是蒋志伟，一名关注品牌营销、动态与新技术的视觉设计师。<br />用有序的视觉，创造有效的沟通。</p>
              <a className="round-link" href="#work" aria-label="查看作品"><Arrow diagonal /></a>
              <div className="hero-index"><span>向下浏览项目</span><b>01</b><i>/ 05</i></div>
            </div>
          </div>
        </section>

        <section className="about section" id="about">
          <div className="frame">
            <div className="section-kicker" data-reveal><span>01</span><p>个人简介 / 工作经历</p></div>
            <div className="about-grid">
              <div className="portrait-wrap" data-reveal>
                {enhancedProfile
                  ? <ProfileCard avatarUrl="/assets/profile-2026.png" name="蒋志伟" />
                  : <img src="/assets/profile-2026.png" alt="蒋志伟个人照" />}
                {!enhancedProfile && <><span className="portrait-label">常驻北京<br />欢迎联系</span><span className="portrait-mark">· JZ ·</span></>}
              </div>
              <div className="about-main" data-reveal>
                <p className="eyebrow-orange">个人简介 · 视觉设计</p>
                <h2>蒋志伟 视觉设计师</h2>
                <div className="about-copy">
                  <p>毕业于广西大学艺术设计专业，曾在小米互联网业务部担任视觉设计师，负责小米影视VIP 宣发与重点营销、小米电视与手机 App 动态视觉等项目。</p>
                  <p>工作中以品牌主视觉、动态内容与多端适配为核心，同时钻研 AI 工具开发，将 AI 与设计工具用于提升视觉生产效率。</p>
                </div>
                <div className="contact-list">
                  <a href="tel:+8618378360024"><span><img src="/logos/phone.svg" alt="" />电话 / 微信</span>+86 183 7836 0024 <Arrow diagonal /></a>
                  <button type="button" onClick={copyEmail}><span><img src="/logos/mail.svg" alt="" />邮箱</span>{copied ? '已复制到剪贴板' : '2523921625@qq.com'} <Arrow diagonal /></button>
                </div>
              </div>
              <aside className="timeline" data-reveal>
                <div className="timeline-item is-current">
                  <time>2025.07 — 2026.08</time><h3>小米科技有限责任公司</h3><p>互联网业务部 · 视觉设计师</p>
                </div>
                <div className="timeline-item">
                  <time>2025.03 — 2025.06</time><h3>小米科技有限责任公司</h3><p>互联网业务部 · 视觉设计实习</p>
                </div>
                <div className="timeline-item">
                  <time>2024.07 — 2024.10</time><h3>TCL 实业集团</h3><p>雷鸟科技设计部 · 运营设计实习</p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="work section" id="work">
          <div className="frame">
            <div className="section-kicker section-kicker--light" data-reveal><span>02</span><p>SELECTED WORK / 2024—2026</p></div>
            <div className="work-heading" data-reveal><h2>关键工作<br /><em>产出。</em></h2><p>从营销视觉、IP 设计到动态与工具创新，<br />在不同屏幕与场景中让设计产生价值。</p></div>
            <div className="projects">
              {projects.map((project) => (
                <article className={project.className} key={project.id} data-reveal>
                  {project.media === 'video'
                    ? <ReliableVideo enabled={enhancedContent} className="project-visual" src={project.asset} aria-label={`${project.title}代表作品`} autoPlay preload="metadata" />
                    : <img className="project-visual" src={project.asset} alt={`${project.title}代表作品`} loading="lazy" />}
                  <div className="project-info">
                    <div><span>{project.id}</span><small>{project.type}</small></div>
                    <h3>{project.title}</h3>
                    <p>{project.desc}</p>
                    <a href={project.href} aria-label={`查看 ${project.title}`}><Arrow diagonal /></a>
                  </div>
                </article>
              ))}
            </div>
            <p className="project-note">上方为项目索引，向下滚动查看案例背景、视觉系统与应用场景。</p>
          </div>
        </section>

        <section className="casebook" id="cases" data-mobile-case={mobileCase}>
          <nav className="mobile-case-switcher" aria-label="手机端项目切换">
            {projects.map((project) => {
              const caseId = project.href.slice(1)
              return (
                <button
                  className={mobileCase === caseId ? 'is-active' : ''}
                  type="button"
                  key={project.id}
                  onClick={() => selectMobileCase(caseId)}
                  aria-pressed={mobileCase === caseId}
                >
                  <span>{project.id}</span>{project.mobileTitle}
                </button>
              )
            })}
          </nav>
          {false && (
          <article className="case-story case-story--vip" id="case-vip">
            <div className="frame">
              <header className="case-header" data-reveal>
                <div><span>CASE STUDY / 01</span><small>2026 · BRAND CAMPAIGN</small></div>
                <h2>小米影视VIP<br /><em>宣发与重点营销</em></h2>
                <p>从微信公众号、小红书、微博日常宣发，到春节和 618 大促，统一品牌与营销表达。</p>
              </header>
              <figure className="case-cover real-cover" data-reveal>
                <img src="/portfolio/vip-cover.webp" alt="小米影视VIP 周末活动电视端资源位" loading="lazy" />
                <figcaption><span>WEEKEND CAMPAIGN / OTT</span><p>围绕剧集内容与年卡权益建立主题化视觉，让促销信息融入观看场景。</p></figcaption>
              </figure>

              <div className="case-facts" data-reveal>
                <div><span>BACKGROUND</span><p>日常内容更新频率高，大促节点信息量大，需要兼顾品牌一致性与转化效率。</p></div>
                <div><span>MY ROLE</span><p>宣发文章配图、主视觉、视频物料、专题页与多场景延展。</p></div>
                <div><span>OUTPUT</span><p>KV / OTT / APP / H5 / SOCIAL / OFFLINE</p></div>
                <div><span>RESULT</span><p>移动端半年销售额达 ¥1600W，同比增长 14%。</p></div>
              </div>

              <section className="case-chapter" data-reveal>
                <div className="chapter-title"><span>01 / DAILY CAMPAIGN</span><h3>先跟随内容气质，<br />再建立会员识别。</h3></div>
                <div className="chapter-copy"><p>日常宣发并不固定套用一种风格，而是从剧集题材、档期氛围和权益类型出发：古装内容使用纸张与墨色，米粉节用轻盈蓝白，618 则切换成高能量的橙红与像素语言。稳定不变的是会员卡、权益层级和清晰的行动入口。</p></div>
              </section>

              <div className="campaign-gallery" data-reveal>
                <figure className="work-shot work-shot--wide"><img src="/portfolio/vip-green-final.webp" alt="畅享版年卡周末剧给力活动画报" loading="lazy" /><figcaption><span>01 / CONTENT CAMPAIGN</span><b>周末剧给力 · 内容主题运营</b></figcaption></figure>
                <figure className="work-shot"><img src="/portfolio/vip-mifan.webp" alt="2026 米粉节畅享版年卡活动资源位" loading="lazy" /><figcaption><span>02 / BRAND FESTIVAL</span><b>米粉节 · 会员年卡直降</b></figcaption></figure>
                <figure className="work-shot"><img src="/portfolio/vip-618-program.webp" alt="618 会员节目推荐海报" loading="lazy" /><figcaption><span>03 / PROGRAM POSTER</span><b>内容、权益与价格同时被看见</b></figcaption></figure>
              </div>

              <section className="focus-project focus-project--618" data-reveal>
                <header className="focus-heading">
                  <div><span>FOCUS PROJECT / 618</span><b>01.1</b></div>
                  <h3>把一次大促，<br /><em>做成可持续的内容事件。</em></h3>
                  <p>本次视觉以“618 抢先省”为总主题，把年卡优惠、联名赠礼和热播内容组织成连续阶段。用户先被鲜明的漫画爆炸框吸引，再快速读到价格与赠品，最后通过资源位节奏完成购买决策。</p>
                </header>

                <figure className="focus-hero focus-hero--real" data-reveal>
                  <img src="/portfolio/vip-618-master.webp" alt="618 抢先省精打细算囤年卡主视觉" loading="lazy" />
                  <figcaption><span>MASTER VISUAL / 16:9</span><p>真实上线主视觉：以大字爆炸框承载核心利益点，会员卡与联名权益形成左右视觉支撑。</p></figcaption>
                </figure>

                <div className="focus-brief" data-reveal>
                  <div><span>项目挑战</span><p>年卡价格、联名赠礼、抽奖和剧集内容同时出现，需要高冲击但不能失去阅读顺序。</p></div>
                  <div><span>核心目标</span><p>用“抢先省”统一全阶段，让用户在一秒内读懂主优惠与附加权益。</p></div>
                  <div><span>设计职责</span><p>视频包装、主视觉、资源位阶段延展、内容海报与多尺寸上线物料。</p></div>
                  <div><span>重点结果</span><p>618 期间收入同比增长 11.9%，视觉方案沉淀为后续营销模板。</p></div>
                </div>

                <section className="case-chapter case-chapter--focus" data-reveal>
                  <div className="chapter-title"><span>01.1 / CAMPAIGN STRATEGY</span><h3>先建立购买理由，<br />再放大节日情绪。</h3></div>
                  <div className="chapter-copy"><p>以“内容吸引—权益解释—价格决策—立即行动”为信息顺序，将一个复杂大促拆成四个连续触点。每个页面只承担一个核心任务，同时共享统一的 618 视觉资产。</p></div>
                </section>

                <div className="strategy-path" data-reveal>
                  <div><span>01</span><small>CONTENT HOOK</small><b>好剧吸引</b><p>用重点内容建立第一眼兴趣</p></div><i />
                  <div><span>02</span><small>VALUE</small><b>权益说明</b><p>用模块化卡片降低理解成本</p></div><i />
                  <div><span>03</span><small>OFFER</small><b>价格决策</b><p>聚焦年卡与限时优惠信息</p></div><i />
                  <div><span>04</span><small>ACTION</small><b>立即开通</b><p>统一按钮与转化路径</p></div>
                </div>

                <section className="case-chapter case-chapter--focus" data-reveal>
                  <div className="chapter-title"><span>01.2 / KEY VISUAL</span><h3>让数字成为符号，<br />让促销拥有质感。</h3></div>
                  <div className="chapter-copy"><p>真实方案采用橙红、亮黄、紫蓝和青绿组成高对比节日色。像素数字、漫画网点、爆炸框和闪电箭头构成统一资产；粗体中文负责第一层利益点，会员卡与赠品模型负责第二层价值解释。</p></div>
                </section>

                <div className="campaign-system" data-reveal>
                  <figure className="campaign-system-main real-panel"><img src="/portfolio/vip-618-benefit.webp" alt="618 囤年卡更优惠活动画面" loading="lazy" /><figcaption><span>BENEFIT FRAME</span><p>优惠主张 + 会员卡 + 联名赠礼</p></figcaption></figure>
                  <div className="campaign-system-side">
                    <figure className="real-panel"><img src="/portfolio/vip-618-social.webp" alt="618 超级狂欢活动社交媒体物料" loading="lazy" /><figcaption><span>SOCIAL EXTENSION</span><p>像素 618 强化节日记忆</p></figcaption></figure>
                    <div className="campaign-colors"><span>COLOR &amp; GRAPHIC ASSETS</span><i>#FF3B24</i><i>#FFB52A</i><i>#7B3FFF</i><i>#54E6D0</i></div>
                  </div>
                </div>

                <section className="case-chapter case-chapter--focus" data-reveal>
                  <div className="chapter-title"><span>01.3 / CHANNEL SYSTEM</span><h3>不是简单裁切，<br />而是为每块屏幕重组。</h3></div>
                  <div className="chapter-copy"><p>本次落地的关键不是把同一张 KV 缩放，而是按照预热、冲刺、巅峰狂降与返场重新编辑利益点。每个阶段更换价格和内容角色，同时保留顶部阶段标签、中心大字与底部礼盒资产，形成连续运营感。</p></div>
                </section>

                <div className="channel-matrix" data-reveal>
                  <figure className="channel-card real-channel real-channel--lead"><img src="/portfolio/vip-618-stage1.webp" alt="618 冲刺加码畅享版年卡立省 220 元" loading="lazy" /><figcaption><span>01 / 冲刺加码</span><b>价格利益点优先</b><p>年卡立省 220 元</p></figcaption></figure>
                  <figure className="channel-card real-channel"><img src="/portfolio/vip-618-stage2.webp" alt="618 巅峰狂降畅享版年卡狂降 220 元" loading="lazy" /><figcaption><span>02 / 巅峰狂降</span><b>内容角色加入</b><p>节目权益强化</p></figcaption></figure>
                  <figure className="channel-card real-channel"><img src="/portfolio/vip-618-stage3.webp" alt="618 返场最后两天畅享版包年低至 249 元" loading="lazy" /><figcaption><span>03 / 返场</span><b>倒计时驱动</b><p>最后两天限时提醒</p></figcaption></figure>
                  <figure className="channel-card real-channel"><img src="/portfolio/vip-618-program.webp" alt="618 会员节目内容海报" loading="lazy" /><figcaption><span>04 / CONTENT</span><b>内容资源位</b><p>把会员权益落到具体节目</p></figcaption></figure>
                </div>

                <div className="delivery-timeline" data-reveal>
                  <div className="delivery-heading"><span>CAMPAIGN RHYTHM</span><h4>一套视觉，覆盖完整营销周期。</h4></div>
                  <div className="delivery-stage"><span>01</span><b>抢先省</b><p>年卡与联名赠礼先建立购买理由</p><small>EARLY BIRD</small></div>
                  <div className="delivery-stage"><span>02</span><b>巅峰狂降</b><p>价格、抽奖和热播内容集中爆发</p><small>PEAK SALE</small></div>
                  <div className="delivery-stage"><span>03</span><b>返场提醒</b><p>用最后两天倒计时完成收口转化</p><small>LAST CALL</small></div>
                </div>
              </section>

              <div className="case-result" data-reveal>
                <span>BUSINESS IMPACT</span>
                <strong>+14<sup>%</sup></strong>
                <p>2026 H1 移动端销售额同比增长<br /><small>618 期间收入同比增长 11.9%</small></p>
              </div>
            </div>
          </article>
          )}

          <article className="case-story case-story--vip" id="case-vip">
            <div className="frame">
              <header className="case-header" data-reveal>
                <div><span>CASE STUDY / 01</span><small>2026 · CONTENT PROMOTION</small></div>
                <h2>小米影视VIP<br /><em>增值运营设计</em></h2>
                <p>围绕 618 与五一档期，完成从内容介绍、公众号长图到小红书和动态 Banner 的连续传播，让每次内容更新拥有清晰、统一的观看入口。</p>
              </header>
              <div className="case-facts vip-promo-facts" data-reveal>
                <div><span>工作内容</span><p>内容选题、视觉主张、长图排版与多渠道延展。</p></div>
                <div><span>核心场景</span><p>{enhancedContent ? '新媒体宣发 / 大促活动 / 日常会员内容推荐。' : '618 年中大促 / 五一假期 / 日常会员内容推荐。'}</p></div>
                <div><span>发布触点</span><p>{enhancedContent ? '公众号长图 / 小红书 / 微博 / 大屏端 OTT / 浮层广告。' : '公众号长图 / 小红书 / 站内动态 Banner。'}</p></div>
                <div><span>设计目标</span><p>在高频更新中维持内容吸引力与会员权益的可读性。</p></div>
              </div>

              <section className="vip-promo-module" data-reveal>
                <header className="vip-promo-heading">
                  <span>{enhancedContent ? 'INTRODUCTION' : '1.1 / INTRODUCTION'}</span>
                  <h3>先让用户知道<br /><em>这一期有什么值得看。</em></h3>
                  <p>以档期内容、会员权益和活动入口建立阅读顺序：先用高识别主标题抓住注意力，再用权益、热播片单与行动按钮完成一次完整的信息传达。</p>
                </header>
                <div className="vip-promo-intro-grid">
                  <figure><img src="/portfolio/vip-promo-618-stage3-intro.webp" alt="618 第三阶段小米影视VIP 宣发长图首屏" loading="lazy" /><figcaption><span>618 / 第三阶段</span><p>以限时节点强化活动收口与权益感知。</p></figcaption></figure>
                  <figure><img src="/portfolio/vip-promo-may-intro.webp" alt="五一 小米影视VIP 宣发长图首屏" loading="lazy" /><figcaption><span>五一 / 假期片单</span><p>以轻快色彩和内容卡片承接假期观看需求。</p></figcaption></figure>
                </div>
              </section>

              <section className="vip-promo-module" data-reveal>
                <header className="vip-promo-heading">
                  <span>{enhancedContent ? '1.1 / LONG-FORM STORY' : '1.2 / LONG-FORM STORY'}</span>
                  <h3>{enhancedContent ? '把复杂营销活动，' : '把复杂信息，'}<br /><em>组织成更想读下去的长图。</em></h3>
                  <p>围绕 618 与五一档期，用权益、内容与行动入口建立清晰阅读节奏。强吸引的首屏与连续的内容编排，让用户更愿意停留、了解会员价值，并为增值营销提供稳定的转化支持。</p>
                </header>
                <MediaViewHint className="project-media-hint--before-media" />
                <div className="vip-promo-long-stories">
                  <article className="vip-promo-long-story">
                    <div className="vip-promo-long-copy"><span>618 / LONG SCROLL</span><h4>用一条长图，<br />串起年中大促的观看理由。</h4><p>从年卡权益、赠礼机制到热播内容，信息由强利益点进入，再逐步展开内容价值与行动入口。读者可以沿着一条明确路径完成理解与决策。</p><small>权益说明 · 内容片单 · 活动入口</small></div>
                    <figure><img src="/portfolio/vip-618-stage1-full.png" alt="618 第一阶段宣发完整长图" loading="lazy" /><figcaption>向下滚动，查看完整长图</figcaption></figure>
                  </article>
                  <article className="vip-promo-long-story">
                    <div className="vip-promo-long-copy"><span>618 / LONG SCROLL</span><h4>用第二条长图，<br />补足大促的完整内容路径。</h4><p>从重点权益、热播片单到行动入口，保持同一阅读结构，同时以不同的视觉节奏承接大促中的内容更新。</p><small>会员权益 · 内容推荐 · 活动入口</small></div>
                    <figure><img src="/portfolio/vip-618-stage3-full.png" alt="618 第三阶段宣发完整长图" loading="lazy" /><figcaption>向下滚动，查看完整长图</figcaption></figure>
                  </article>
                  <article className="vip-promo-long-story vip-promo-long-story--intro">
                    <div className="vip-promo-long-copy"><span>五一 / 第一阶段</span><h4>把片单与福利，<br />放进假期第一眼。</h4><p>以轻快的色彩和内容卡片承接假期观看需求，让用户先理解本期福利，再进入内容选择。</p><small>五一 / 第一阶段长图</small></div>
                    <figure><img src="/portfolio/vip-may-stage1-full.png" alt="五一第一阶段宣发长图完整展示" loading="lazy" /><figcaption>完整长图展示</figcaption></figure>
                  </article>
                  <article className="vip-promo-long-story vip-promo-long-story--intro">
                    <div className="vip-promo-long-copy"><span>五一 / 第二阶段</span><h4>用持续更新的内容，<br />延长假期参与感。</h4><p>在统一的传播框架中更新内容与权益信息，使第二阶段仍维持清晰的阅读节奏和行动入口。</p><small>五一 / 第二阶段长图</small></div>
                    <figure><img src="/portfolio/vip-may-stage2-full.png" alt="五一第二阶段宣发长图完整展示" loading="lazy" /><figcaption>完整长图展示</figcaption></figure>
                  </article>
                </div>
                {enhancedContent && <p className="vip-long-scroll-hint">向下滚动查看完整长图</p>}
              </section>

              <section className="vip-promo-module vip-promo-module--extension" data-reveal>
                <header className="vip-promo-heading">
                  <span>{enhancedContent ? '1.2 / SOCIAL & BANNER EXTENSION' : '1.3 / SOCIAL & BANNER EXTENSION'}</span>
                  <h3>一套内容，<br /><em>在不同触点继续发生。</em></h3>
                  <p>将长图中的核心利益点重新组合为适合社媒浏览的单张内容，同时通过动态 Banner 在站内完成高频、轻量的活动提醒；画面统一，但每种媒介都保留自己的阅读节奏。</p>
                </header>
                <MediaViewHint className="project-media-hint--before-media" />
                <div className="vip-promo-extension-grid">
                  <div className="vip-promo-social-pair">
                    <figure><img src="/portfolio/vip-promo-xhs-618-1.webp" alt="618 小红书会员权益活动物料" loading="lazy" /><figcaption>小红书 / 互动福利</figcaption></figure>
                    <figure><img src="/portfolio/vip-promo-xhs-618-2.webp" alt="618 小红书剧集评分活动物料" loading="lazy" /><figcaption>小红书 / 内容互动</figcaption></figure>
                  </div>
                  <div className="vip-promo-banner-pair">
                    <figure><img src="/portfolio/vip-promo-618-banner.webp" alt="618 第三阶段动态 Banner" loading="eager" decoding="async" fetchPriority="high" /><figcaption><span>618 / MOTION BANNER</span><b>会员权益动态提醒</b></figcaption></figure>
                    <figure><img src="/portfolio/vip-promo-may-banner.webp" alt="五一第三阶段动态 Banner" loading="eager" decoding="async" fetchPriority="high" /><figcaption><span>五一 / MOTION BANNER</span><b>假期看片活动入口</b></figcaption></figure>
                  </div>
                </div>
              </section>

              <div className="case-result vip-promo-result" data-reveal>
                <span>BUSINESS IMPACT / 2026 H1</span>
                <div className="vip-promo-sales"><strong><span>¥1600<span className="metric-accent">W</span></span><sup>+</sup></strong><p>2026 年上半年移动端销售额</p></div>
                <strong><span className="metric-accent">YOY</span>+14<sup>%</sup></strong>
              </div>

              <section className="jd-promo-module" data-reveal>
                <header className="jd-promo-heading">
                  <span>{enhancedContent ? '1.3 / JD 11.11 · MULTI-ENTRY CAMPAIGN' : '1.4 / JD 11.11 · MULTI-ENTRY CAMPAIGN'}</span>
                  <h3>把 11.11 的<br /><em>促销感带进每个入口。</em></h3>
                  <p>围绕京东 11.11 补贴主题，针对全搜、内容中心、浏览器与负一屏等不同信息入口，完成高识别的多尺寸视觉延展。</p>
                </header>
                <MediaViewHint className="project-media-hint--before-media" />
                {enhancedContent && <h4 className="jd-promo-board-title">手机浮层广告</h4>}
                <div className="jd-promo-board">
                  <figure className="jd-promo-main"><img src="/portfolio/jd-search-card.png" alt="京东十一点一浮层主视觉" loading="lazy" /><figcaption><span>浮层主视觉</span><b>用高识别利益点先完成注意力聚焦</b></figcaption></figure>
                  <div className="jd-promo-support">
                    <figure><img src="/portfolio/jd-content-03.png" alt="京东十一点一浮层视觉一" loading="lazy" /><figcaption>浮层视觉一</figcaption></figure>
                    <figure><img src="/portfolio/jd-content-04.png" alt="京东十一点一浮层视觉二" loading="lazy" /><figcaption>浮层视觉二</figcaption></figure>
                    <figure><img src="/portfolio/jd-browser.png" alt="京东十一点一浮层视觉三" loading="lazy" /><figcaption>浮层视觉三</figcaption></figure>
                    <figure><img src="/portfolio/jd-content-06.png" alt="京东十一点一浮层视觉四" loading="lazy" /><figcaption>浮层视觉四</figcaption></figure>
                  </div>
                </div>
                <div className="jd-negative-wall">
                  <span>{enhancedContent ? '负一屏延展' : '负一屏多版本延展'}</span>
                  <figure><img src="/portfolio/jd-negative-01.png" alt="京东十一点一负一屏视觉版本一" loading="lazy" /></figure>
                  <figure><img src="/portfolio/jd-negative-02.png" alt="京东十一点一负一屏视觉版本二" loading="lazy" /></figure>
                  <figure><img src="/portfolio/jd-negative-03.png" alt="京东十一点一负一屏视觉版本三" loading="lazy" /></figure>
                  <figure><img src="/portfolio/jd-negative-04.png" alt="京东十一点一负一屏视觉版本四" loading="lazy" /></figure>
                  <figure><img src="/portfolio/jd-negative-05.png" alt="京东十一点一负一屏视觉版本五" loading="lazy" /></figure>
                  <figure><img src="/portfolio/jd-negative-06.png" alt="京东十一点一负一屏视觉版本六" loading="lazy" /></figure>
                </div>
              </section>

              <section className="key-marketing-module" data-reveal>
                <header className="key-marketing-heading">
                  <span>{enhancedContent ? '1.4 / KEY MARKETING · 2026' : '1.5 / KEY MARKETING · 2026'}</span>
                  <h3>重点营销，<br /><em>转化增长。</em></h3>
                  <p>围绕综艺热点与暑期观影福利，将会员权益、竞猜互动、节目内容与抽奖任务编排为连续的活动体验。</p>
                  <MediaViewHint className="project-media-hint--key-marketing" />
                </header>
                <div className="key-marketing-lottery">
                  <header><span>01 / SUMMER LOTTERY</span><h4>暑期抽奖，连接<br />会员与内容福利。</h4><p>不同奖品与内容权益组合为轻量的参与任务，丰富活动节奏，同时让画面保持完整的暑期氛围。</p></header>
                  <figure><img src="/portfolio/key-marketing/mmexport1785157209761.jpg" alt="暑期观影福利抽奖主页面" loading="lazy" /></figure>
                  <div className="key-marketing-lottery-cards">
                    <img src="/portfolio/key-marketing/mmexport1785157216347.jpg" alt="八仙电影票抽奖素材" loading="lazy" />
                    <img src="/portfolio/key-marketing/mmexport1785157213493.jpg" alt="动物城电影周边抽奖素材" loading="lazy" />
                  </div>
                </div>
                <div className="key-marketing-showcase">
                  <figure><img src="/portfolio/key-marketing/mmexport1785228997194.jpg" alt="乘风舞台节目现场入口" loading="lazy" /><figcaption>节目现场 / 内容入口</figcaption></figure>
                  <figure><img src="/portfolio/key-marketing/mmexport1785228994209.jpg" alt="乘风舞台竞猜互动页面" loading="lazy" /><figcaption>竞猜互动 / 任务路径</figcaption></figure>
                </div>
                <div className="key-marketing-feature">
                  <figure><img src="/portfolio/key-marketing/mmexport1785228980207.jpg" alt="乘风会员权益主视觉" loading="lazy" /></figure>
                  <div><span>02 / MEMBER BENEFIT</span><h4>以节目热度承接<br />会员权益转化。</h4><p>把“畅享版”价格利益点与综艺系列视觉结合，让入口、购买与内容推荐拥有同一套识别记忆。</p></div>
                </div>
                <div className="key-marketing-ribbons">
                  <img src="/portfolio/key-marketing/mmexport1785228989025.jpg" alt="乘风舞台竞猜活动入口" loading="lazy" />
                  <img src="/portfolio/key-marketing/mmexport1785228991679.jpg" alt="乘风会员优惠横幅" loading="lazy" />
                </div>
              </section>
            </div>
          </article>

          <article className="case-story case-story--mihome" id="case-mihome">
            <div className="frame">
              <header className="case-header" data-reveal>
                <div><span>CASE STUDY / 03</span><small>2026 · IP SYSTEM</small></div>
                <h2>Mihome IP<br /><em>形象与视觉体系</em></h2>
                <p>{enhancedContent ? '以“三代同屏、六类内容场景”为结构，建立 Mihome Family 家庭角色体系，让电视内容服务拥有更亲切、更可持续的品牌人格，也代表用户可以获得更沉浸式的内容体验。' : '以“三代同屏、六类内容场景”为结构，建立 Mihome Family 家庭角色体系，让电视内容服务拥有更亲切、更可持续的品牌人格。'}</p>
              </header>
              <figure className="case-cover case-cover--mihome real-cover" data-reveal><img src="/portfolio/mihome-cover.webp" alt="Mihome Family 家庭角色系统主视觉" loading="lazy" /><figcaption><span>MIHOME FAMILY / 2026 VERSION</span><p>Home begins in everyone’s own scene.</p></figcaption></figure>

              <div className="case-facts" data-reveal>
                <div><span>OBJECTIVE</span><p>用家庭成员承接电影、少儿、音乐、体育、教育与 K 歌六类内容入口。</p></div>
                <div><span>SYSTEM</span><p>三头身比例、柔和织物材质、默认微笑与成员专属色。</p></div>
                <div><span>APPLICATION</span><p>内容频道 / 春节营销 / 活动入口 / 购买入口 / OTT 大屏。</p></div>
                <div><span>STATUS</span><p>春节营销相关活动与购买入口已正式上线。</p></div>
              </div>

              <section className="case-chapter" data-reveal>
                <div className="chapter-title"><span>3.1 / IP GRAMMAR</span><h3>同一套视觉语言，<br />保留六种家庭身份。</h3></div>
                <div className="chapter-copy"><p>角色统一使用三头身比例、圆形体块和柔软织物材质，保证安全、亲切与大屏可读性；再通过发型、眼镜、胡须和成员专属色形成差异，让六位人物既像一家人，又能分别代表内容偏好。</p></div>
              </section>

              <MediaViewHint className="project-media-hint--before-media" />

              <div className="ip-system ip-system--real" data-reveal>
                <figure><img src="/portfolio/mihome-family.webp" alt="Mihome 六位家庭成员角色设定" loading="lazy" /><figcaption><span>CHARACTER FAMILY</span><p>六位角色 · 三代家庭 · 六类内容偏好</p></figcaption></figure>
                <figure><img src="/portfolio/mihome-system.webp" alt="Mihome 角色比例材质与识别系统" loading="lazy" /><figcaption><span>DESIGN SYSTEM</span><p>比例、材质、表情与差异化识别规则</p></figcaption></figure>
              </div>

              <section className="mihome-intro-applications" data-reveal>
                <div className="ip-applications">
                  <div className="ip-app-scroll-card ip-app-scroll-card--festival">
                    <figure className="ip-app ip-app--real ip-app--festival ip-app--scrollable"><img src="/portfolio/mihome-scenes.webp" alt="Mihome 家庭角色在娱乐教育生活场景中的应用" loading="lazy" /></figure>
                    <p className="ip-scroll-hint"><b>角色场景与节日大屏应用</b></p>
                  </div>
                  <div className="mihome-intro-aside">
                    <div className="ip-app-scroll-card">
                      <figure className="ip-app ip-app--real ip-app--scrollable"><img src="/portfolio/mihome-newyear.webp" alt="Mihome Family 春节大屏营销应用" loading="lazy" /></figure>
                      <p className="ip-scroll-hint"><b>春节大屏营销场景</b></p>
                    </div>
                    <div className="mihome-intro-note">
                      <span>视觉触点系统</span>
                      <h4>让内容入口拥有可识别的家庭氛围。</h4>
                      <p>{enhancedContent ? '以角色关系、色彩情绪与内容卡片组织频道和活动页面，让用户在不同内容入口中快速理解场景，感知到更温馨的内容氛围，并获得统一的品牌体验。' : '以角色关系、色彩情绪与内容卡片组织频道和活动页面，让用户在不同内容入口中快速理解场景，并感知统一的品牌体验。'}</p>
                    </div>
                  </div>
                </div>
                <header>
                  <span>3.2 / APPLICATION</span>
                  <h3>让IP形象进入真实落地场景，<br /><em>推进营销增长。</em></h3>
                  <p>从内容运营、春节大屏到活动入口，让角色系统进入真实场景，并服务于持续的营销增长。</p>
                </header>
              </section>

              <MediaViewHint className="project-media-hint--before-media" />
              <section className="mihome-real-applications" data-reveal>
                <div className="mihome-app-pages">
                  <section className="mihome-app-page">
                    <header><span>PAGE 01 / DESKTOP APPLICATION</span><h4>电视端 3.0 系统主视觉</h4><p>以购买、权益与重点内容为线索，在大屏页面中建立清晰的转化入口。</p></header>
                    <div className="mihome-screen-grid">
                      <figure><img src="/portfolio/mihome-buy-04.webp" alt="电脑端购买入口强展示一" loading="lazy" /><figcaption>01</figcaption></figure>
                      <figure><img src="/portfolio/mihome-buy-06.webp" alt="电脑端购买入口强展示二" loading="lazy" /><figcaption>02</figcaption></figure>
                      <figure><img src="/portfolio/mihome-buy-05.webp" alt="电脑端购买入口强展示三" loading="lazy" /><figcaption>03</figcaption></figure>
                      <figure><img src="/portfolio/mihome-activity-05.webp" alt="电脑端活动入口强展示四" loading="lazy" /><figcaption>04</figcaption></figure>
                    </div>
                  </section>

                  <section className="mihome-app-page">
                    <header><span>PAGE 02 / DESKTOP APPLICATION</span><h4>电视端 4.0 系统主视觉</h4><p>将活动氛围、会员价值与内容推荐继续延展为稳定、完整的视觉系统。</p></header>
                    <div className="mihome-screen-grid">
                      <figure><img src="/portfolio/mihome-activity-04.webp" alt="电脑端活动入口强展示五" loading="lazy" /><figcaption>05</figcaption></figure>
                      <figure><img src="/portfolio/mihome-buy-03.webp" alt="电脑端购买入口强展示六" loading="lazy" /><figcaption>06</figcaption></figure>
                      <figure><img src="/portfolio/mihome-activity-03.webp" alt="电脑端活动入口强展示七" loading="lazy" /><figcaption>07</figcaption></figure>
                      <figure><img src="/portfolio/mihome-buy-02.webp" alt="电脑端购买入口强展示八" loading="lazy" /><figcaption>08</figcaption></figure>
                    </div>
                  </section>
                </div>

                <div className="mihome-long-scrolls">
                  <article>
                    <div className="mihome-long-copy"><span>SPRING FESTIVAL / STAGE 02</span><h4>从会员权益<br />延展到全家共赏。</h4><p>将权益、片单、互动与抽奖统一进一条纵向阅读路径，让信息在热闹的春节视觉中仍然清晰可读。</p><small>SCROLL TO EXPLORE</small></div>
                    <figure><img src="/portfolio/mihome-cny-phase2.webp" alt="Mihome 春节营销第二阶段长图" loading="lazy" /><figcaption>向下滚动查看完整长图</figcaption></figure>
                  </article>
                  <article>
                    <div className="mihome-long-copy"><span>SPRING FESTIVAL / STAGE 03</span><h4>以新春主视觉<br />串联购买与互动。</h4><p>{enhancedContent ? '强化节日利益点，并以内容推荐、互动玩法和奖品回收延续用户的阅读与参与节奏。' : '第三阶段强化节日利益点，并以内容推荐、互动玩法和奖品回收延续用户的阅读与参与节奏。'}</p><small>SCROLL TO EXPLORE</small></div>
                    <figure><img src="/portfolio/mihome-cny-phase3.webp" alt="Mihome 春节营销第三阶段长图" loading="lazy" /><figcaption>向下滚动查看完整长图</figcaption></figure>
                  </article>
                </div>
              </section>
            </div>
          </article>

          <article className="case-story case-story--motion" id="case-motion">
            <div className="frame">
              <header className="case-header" data-reveal>
                <div><span>CASE STUDY / 02</span><small>2025—2026 · OTT + APP MOTION</small></div>
                <h2>小米电视与 App<br /><em>活动动态视觉</em></h2>
                <p>围绕大屏开机、手机开屏与资源位广告，以动态节奏、画面转场和视觉特效快速聚焦注意力，让品牌卖点在有限曝光时间内更直观地被理解和记住。</p>
              </header>
              <section className="motion-reel" data-reveal>
                <section className="motion-terminal motion-terminal--tv">
                  <header><span>2.1 / TV TERMINAL</span><h4>电视端创意开机</h4><p>结合视觉特效、三维与 AIGC 动态制作，将产品卖点和品牌氛围转化为具有节奏的开机广告，提升首帧吸引力与信息记忆。</p></header>
                  <div className="motion-tv-grid">
                    <figure><ReliableVideo enabled={enhancedContent} src="/portfolio/motion/tv-kfc.mp4" autoPlay preload="metadata" /><figcaption>{enhancedContent ? 'KFC × 哆啦 A 梦广告' : <><span>KFC × 哆啦 A 梦</span><b>角色叙事创意开机</b></>}</figcaption></figure>
                    <figure><ReliableVideo enabled={enhancedContent} src={enhancedContent ? '/portfolio/motion/tv-canon-logo-3.mp4' : '/portfolio/motion/tv-canon-film.mp4'} autoPlay preload="metadata" /><figcaption>{enhancedContent ? '佳能广告' : <><span>佳能</span><b>大屏品牌影片</b></>}</figcaption></figure>
                    <figure><ReliableVideo enabled={enhancedContent} src="/portfolio/motion/tv-crunchy-rice.mp4" autoPlay preload="metadata" /><figcaption>{enhancedContent ? '脆香米广告' : '脆香米'}</figcaption></figure>
                    <figure><ReliableVideo enabled={enhancedContent} src="/portfolio/motion/tv-coke.mp4" autoPlay preload="metadata" /><figcaption>{enhancedContent ? '可口可乐广告混剪' : '可口可乐广告'}</figcaption></figure>
                    <figure><ReliableVideo enabled={enhancedContent} src="/portfolio/motion/tv-mead-johnson.mp4" autoPlay preload="metadata" /><figcaption>美赞臣广告</figcaption></figure>
                    <figure><ReliableVideo enabled={enhancedContent} src="/portfolio/motion/tv-wahaha.mp4" autoPlay preload="metadata" /><figcaption>{enhancedContent ? '娃哈哈冰红茶广告' : '娃哈哈冰红茶'}</figcaption></figure>
                  </div>
                  <MediaViewHint kind="video" className="project-media-hint--after-media" />
                  <div className="motion-tv-result"><span>2025 年下半年 · 创意开机项目收入</span><strong>{enhancedContent ? <><span>¥500<span className="metric-accent">W</span></span><sup>+</sup></> : <>¥500<sup>W+</sup></>}</strong><p>创意开机项目创收</p></div>
                </section>

                <section className="motion-terminal motion-terminal--mobile">
                  <header><span>2.2 / 手机端开屏</span><h4>手机端品牌开屏</h4><p>通过三维制作、环境特效与开屏动效强化画面冲击，在更小的屏幕中快速建立品牌记忆，并将用户注意力引向核心行动。</p></header>
                  <div className="motion-mobile-grid">
                    <figure><ReliableVideo enabled={enhancedContent} src="/portfolio/motion/mobile-airchina.mp4" autoPlay preload="metadata" /><figcaption><span>国航开屏</span><b>品牌首帧</b></figcaption></figure>
                    <figure><ReliableVideo enabled={enhancedContent} src="/portfolio/motion/mobile-rain.mp4" autoPlay preload="metadata" /><figcaption><span>下雨动画</span><b>环境状态动效</b></figcaption></figure>
                    <figure><ReliableVideo enabled={enhancedContent} src="/portfolio/motion/mobile-wind.mp4" autoPlay preload="metadata" /><figcaption><span>大风动画</span><b>环境状态动效</b></figcaption></figure>
                  </div>
                  <MediaViewHint kind="video" className="project-media-hint--after-media" />
                </section>

                <section className="motion-terminal motion-terminal--campaign">
                  <header><span>2.3 / CAMPAIGN MOTION</span><h4>活动资源位动态图</h4><p>把首页背景中使用的活动素材保留为动态展示，在案例中补充其在不同资源位中的节奏与信息层级。</p></header>
                  <div className="motion-campaign-grid">
                    <figure><img src="/hero/618-stage2.webp" alt="618 第二阶段资源位动态图" loading="lazy" /><figcaption>618 / 第二阶段</figcaption></figure>
                    <figure><img src="/hero/618-stage3.webp" alt="618 第三阶段资源位动态图" loading="lazy" /><figcaption>618 / 第三阶段</figcaption></figure>
                    <figure><img src="/hero/618-content.webp" alt="618 内容资源位动态图" loading="lazy" /><figcaption>618 / 内容资源位</figcaption></figure>
                    <figure><img src="/hero/weekend-cinema.webp" alt="周末影院资源位动态图" loading="lazy" /><figcaption>周末影院 / 资源位</figcaption></figure>
                    <figure><img src="/hero/618-buy.webp" alt="618 购买入口动态图" loading="lazy" /><figcaption>618 / 购买入口</figcaption></figure>
                    <figure><img src="/hero/618-countdown.webp" alt="618 倒计时动态图" loading="lazy" /><figcaption>618 / 倒计时提醒</figcaption></figure>
                    <figure><img src="/hero/618-benefit.webp" alt="618 会员权益动态图" loading="lazy" /><figcaption>618 / 会员权益</figcaption></figure>
                    <figure><img src="/hero/weekend-purple.webp" alt="周末影院紫色资源位动态图" loading="lazy" /><figcaption>周末影院 / 主题延展</figcaption></figure>
                  </div>
                  <MediaViewHint className="project-media-hint--campaign-grid" />
                </section>
              </section>

              <div className="system-split motion-showcase" data-reveal>
                <figure className="motion-shot"><img src="/portfolio/motion-02.webp" alt="小米影视 VIP 家庭大屏观看宣发视频帧" loading="lazy" /><figcaption><span>OTT VIEWING SCENE</span><p>用家庭共看场景承接电视端沉浸体验</p></figcaption></figure>
                <figure className="motion-shot"><img src="/portfolio/motion-04.webp" alt="小米影视 VIP 手机观看宣发视频帧" loading="lazy" /><figcaption><span>MOBILE VIEWING SCENE</span><p>手机界面前置，快速说明跨端会员权益</p></figcaption></figure>
              </div>

              <div className="case-facts" data-reveal>
                <div><span>BACKGROUND</span><p>“大小屏都能看”的权益需要在短视频时间内被直观理解，而不是停留在口播说明。</p></div>
                <div><span>MY ROLE</span><p>视频脚本视觉化、关键帧设计、文字动效、界面合成与节奏规划。</p></div>
                <div><span>OUTPUT</span><p>宣发视频 / OTT 活动入口 / App 开屏 / 浮层广告 / 品牌片尾。</p></div>
                <div><span>RESULT</span><p>2025 H2 创意开机项目创收超 ¥500W。</p></div>
              </div>

              <section className="case-chapter" data-reveal>
                <div className="chapter-title"><span>02 / MOTION LANGUAGE</span><h3>从大屏开机，<br />到移动端一瞬。</h3></div>
                <div className="chapter-copy"><p>大屏强调沉浸感、空间和品牌展示；移动端侧重首帧效率、信息层级与快速转化。</p></div>
              </section>

              <div className="motion-format-grid" data-reveal>
                <div><span>01 / OTT ENTRY</span><b>活动入口动效</b><i /></div>
                <div><span>02 / BOOT VIDEO</span><b>品牌创意开机</b><i /></div>
                <div><span>03 / APP SPLASH</span><b>移动端动态开屏</b><i /></div>
                <div><span>04 / 3D CREATIVE</span><b>浮层与三维创意</b><i /></div>
              </div>

              <section className="motion-context" data-reveal>
                <div className="motion-context-heading"><span>VIEWING CONTEXT</span><h3>同一个品牌动作，<br />在两块屏幕上有不同节奏。</h3></div>
                <div className="motion-context-item"><span>OTT / 3–5M</span><b>沉浸与空间</b><p>电视端拥有更长观看时间，强调景深、镜头运动和品牌完整露出。</p><small>LONGER VIEW · CINEMATIC</small></div>
                <div className="motion-context-item"><span>APP / 30–50CM</span><b>首帧与效率</b><p>手机端需要在第一秒完成识别，强化核心信息、触控路径和循环节奏。</p><small>FAST READ · CONVERSION</small></div>
              </section>

              <section className="case-chapter case-chapter--motion" data-reveal>
                <div className="chapter-title"><span>02.1 / STORYBOARD</span><h3>先定义情绪曲线，<br />再设计每一帧。</h3></div>
                <div className="chapter-copy"><p>脚本从真人近景快速建立注意力，用发光中文说明畅享版权益，再切入全家看电视的生活场景；小米影视标识作为转场装置穿过镜头，最后落到手机界面与节目内容。即使静音，也能依靠关键文字和界面顺序读懂产品价值。</p></div>
              </section>

              <div className="storyboard" data-reveal>
                <figure className="story-frame"><img src="/portfolio/motion-01.webp" alt="畅享版视频第一帧人物与标题" loading="lazy" /><figcaption><span>00:00</span><b>人物进入</b><small>ATTRACT</small></figcaption></figure>
                <figure className="story-frame"><img src="/portfolio/motion-02.webp" alt="全家观看电视场景" loading="lazy" /><figcaption><span>00:01</span><b>大屏共看</b><small>CONTEXT</small></figcaption></figure>
                <figure className="story-frame"><img src="/portfolio/motion-03.webp" alt="小米影视品牌标志转场" loading="lazy" /><figcaption><span>00:02</span><b>品牌转场</b><small>TRANSITION</small></figcaption></figure>
                <figure className="story-frame"><img src="/portfolio/motion-04.webp" alt="手机端观看权益场景" loading="lazy" /><figcaption><span>00:03</span><b>手机也能看</b><small>BENEFIT</small></figcaption></figure>
                <div className="story-track"><span>ENERGY</span><i /><i /><i /><i /><b>0S</b><b>1S</b><b>2S</b><b>3S</b></div>
              </div>

              <div className="motion-rules" data-reveal>
                <div className="motion-rules-copy"><span>MOTION PRINCIPLES</span><h3>可复用的动态语言，<br />而不是单次特效。</h3><p>把速度、层级和转场方式沉淀为基本规范，让不同活动、不同设计师输出时仍能保持统一的品牌感受。</p></div>
                <div className="motion-rule"><span>01 / TEMPO</span><div className="tempo-bars"><i /><i /><i /><i /><i /></div><b>快进 · 缓停</b><p>用前快后慢的节奏引导注意力落到核心信息。</p></div>
                <div className="motion-rule"><span>02 / DEPTH</span><div className="depth-rings"><i /><i /><i /></div><b>前景 · 主体 · 环境</b><p>通过三层空间关系建立大屏沉浸感。</p></div>
                <div className="motion-rule"><span>03 / LOOP</span><div className="loop-mark">∞</div><b>自然循环</b><p>移动端首尾连续，减少重复播放的跳切感。</p></div>
              </div>

              <section className="case-chapter case-chapter--motion" data-reveal>
                <div className="chapter-title"><span>02.2 / SCREEN ADAPTATION</span><h3>核心识别不变，<br />信息密度随屏幕改变。</h3></div>
                  <div className="chapter-copy"><p>电视端先呈现家庭共看的真实空间，再把内容墙完整推到大屏；移动端则让手机和权益卡更早出现，文字贴近人物动作。两端共享暖金色发光文字、品牌标识和节目封面，但根据观看距离重新分配画面主体。</p></div>
              </section>

              <div className="motion-adaptation" data-reveal>
                <figure className="adaptation-screen adaptation-screen--real"><img src="/portfolio/motion-02.webp" alt="电视端家庭观看场景适配" loading="lazy" /><figcaption><span>OTT MASTER / 16:9</span><p>人物与电视同框，先建立共看氛围</p></figcaption></figure>
                <div className="adaptation-connector"><i /><span>REFRAME</span><i /></div>
                <figure className="adaptation-screen adaptation-screen--real adaptation-screen--crop"><img src="/portfolio/motion-04.webp" alt="手机端权益画面适配" loading="lazy" /><figcaption><span>APP FOCUS</span><p>放大手机界面与跨端权益</p></figcaption></figure>
              </div>

              <div className="system-result motion-income-result" data-reveal><span>项目收入 / 2025 年下半年</span><strong>¥500<sup>W+</sup></strong><p>创意开机项目收入</p></div>
            </div>
          </article>

          <article className="case-story case-story--ai" id="case-ai">
            <div className="frame">
              <header className="case-header" data-reveal>
                <div><span>CASE STUDY / 04</span><small>2026 · AI DESIGN WORKFLOW</small></div>
                <h2>AI 工具化：让重复制作<br /><em>回到创意本身</em></h2>
                <p>从设计稿中反复出现的找素材、对规格、换画框出发，将工作流收敛为「组件替换小助手」：在 Figma 内完成检索、定位与批量替换。</p>
              </header>
              <MediaViewHint className="project-media-hint--case" />

              <section className="ai-tool-board" data-reveal>
                <div className="ai-tool-overview">
                  <span>4.1 / 工具链</span>
                  <h3>从 AI 构想<br />到插件落地</h3>
                  <div className="ai-tool-callout"><small>背景</small><p>资源位规格多、延展繁琐，将重复流程沉淀为 AI 可复用方案，把时间还给视觉策略与关键创意。</p></div>
                  <p className="ai-tool-description">使用 Claude + Codex 产出“组件替换助手”Figma 插件，实现组件、图层自动替换。</p>
                  <div className="ai-tool-stack">
                    <div className="ai-tool-brand"><img className="claude-logo" src="/logos/claude.ico" alt="Claude Logo" /><span><b>Claude</b><small>方案推演</small></span></div>
                    <div className="ai-tool-brand"><img src="/logos/codex.svg" alt="Codex Logo" /><span><b>Codex</b><small>插件生成</small></span></div>
                  </div>
                </div>
                <figure className="ai-tool-figure">
                  <img src="/portfolio/ai-component-replace.webp" alt="组件替换助手 Figma 插件界面" loading="lazy" />
                  <figcaption>组件替换小助手 / Figma 生产插件</figcaption>
                </figure>
                <div className="ai-tool-result">
                  <span>4.2 / IN PRODUCTION</span>
                  <h3>让制作<br />更快发生</h3>
                  <div className="ai-tool-status">
                    <div><span>目标画框名称</span><b>快速定位</b></div>
                    <div><span>资源位替换</span><b>批量执行</b></div>
                    <div><span>618 活动项目</span><b>真实使用</b></div>
                  </div>
                  <div className="ai-tool-lift"><span>设计提效</span><strong>50<sup>%+</sup></strong><p>组件替换小助手已投入 618 活动的日常视觉生产。</p></div>
                </div>
              </section>
            </div>
          </article>

          <section className="archive frame" data-reveal>
            <header className="archive-header"><div><span>VISUAL ARCHIVE</span><b>2025—2026</b></div><h2>更多视觉产出<br /><em>与日常实践。</em></h2><p>从电视端资源位、品牌动态到节日场景，以下均来自本轮筛选后的真实工作文件。</p></header>
            <MediaViewHint kind="both" className="project-media-hint--archive" />
            <div className="archive-grid">
              {archiveItems.map((item, index) => {
                const no = item.no || `A${String(index + 1).padStart(2, '0')}`
                const isDelongReplacement = enhancedContent && no === 'A11'
                const asset = isDelongReplacement ? '/portfolio/motion/tv-delong-tmall.mp4' : item.asset
                const title = isDelongReplacement ? '德龙创意开机' : (enhancedContent && no === 'A12' ? '美汁源OTT大视界' : item.title)
                const format = `${item.type === '动态 Banner' ? 'archive-item--banner' : (item.long ? 'archive-item--heat' : (item.type === '长图宣发' || item.type === '社媒视觉' ? 'archive-item--portrait' : ''))}${item.long ? ' archive-item--long-scroll' : ''}${item.media === 'video' ? ' archive-item--video' : ''}${item.type === '动态练习' ? ' archive-item--practice' : ''}`
                return (
                <article className={`archive-item ${format}`} key={asset}>
                  <div className="archive-art archive-art--real">{item.media === 'video' ? <ReliableVideo enabled={enhancedContent} src={asset} aria-label={title} autoPlay preload="metadata" /> : <img src={asset} alt={title} loading={item.type === '动态 Banner' ? 'eager' : 'lazy'} decoding="async" />}{!enhancedContent && <strong>{no}</strong>}</div>
                  <div><span>{enhancedContent ? item.type : `${no} / ${item.type}`}</span><h3>{title}</h3></div>
                </article>
                )
              })}
            </div>
          </section>
        </section>

        <section className="strength section" id="strength">
          <div className="frame">
            <div className="section-kicker" data-reveal><span>03</span><p>CORE STRENGTHS</p></div>
            <div className="capability-grid">
              {capabilities.map((item) => (
                <article className="capability" key={item.no} data-reveal>
                  <div className="capability-top"><span>{item.no}</span><i /></div>
                  <small>{item.en}</small><h3>{item.title}</h3><p>{item.text}</p>
                  <a className="capability-link" href={item.href}>查看项目 <Arrow diagonal /></a>
                </article>
              ))}
            </div>
            <div className="tools" data-reveal><span>SELECTED TOOLS</span><p>PHOTOSHOP · ILLUSTRATOR · FIGMA · AFTER EFFECTS · BLENDER · CODEX · CLAUDE</p></div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="contact-aura" /><div className="contact-grid" />
          <div className="frame contact-inner">
            <div className="contact-top"><span>04 / CONTACT</span><p>OPEN TO FULL-TIME &amp; CREATIVE COLLABORATIONS<br />BEIJING · SHANGHAI · SHENZHEN</p></div>
            <div className="contact-center" data-reveal>
              <p>HAVE A PROJECT IN MIND?</p>
              <h2>期待您的<br /><em>联系。</em></h2>
              <div className="contact-details"><a href="tel:+8618378360024" onClick={enhancedContent ? (event) => event.preventDefault() : undefined}><img src="/logos/phone.svg" alt="" />电话 / 微信 · 183 7836 0024</a><a href="mailto:2523921625@qq.com" onClick={enhancedContent ? (event) => event.preventDefault() : undefined}><img src="/logos/mail.svg" alt="" />邮箱 · 2523921625@qq.com</a></div>
            </div>
            <div className="contact-bottom">
              <p>蒋志伟 · VISUAL DESIGNER</p>
              <div><a href="#top">回到首页 ↑</a></div>
              <span>© 2026 PORTFOLIO</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
