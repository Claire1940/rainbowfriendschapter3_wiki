"use client";

import { Suspense, lazy } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CalendarClock,
  Clapperboard,
  Clock,
  Compass,
  ExternalLink,
  Eye,
  Flame,
  Footprints,
  Map as MapIcon,
  Newspaper,
  Route,
  Ship,
  Skull,
  Sparkles,
  Ticket,
  Waves,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
// import { SidebarAd } from "@/components/ads/SidebarAd"; // 废弃广告位，不再接回
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// 统一的模块标题区（eyebrow badge + 标题 + 副标题）
function ModuleHeader({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="text-center mb-8 md:mb-12 scroll-reveal">
      <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2 mb-4 md:mb-6 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
        <Icon className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
        <span className="text-xs md:text-sm font-medium">{eyebrow}</span>
      </div>
      <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </header>
  );
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.rainbowfriendschapter3.wiki";

  // Tools Grid 卡片锚点 - 与下方 8 个模块 section id 一一对应
  const sectionIds = [
    "release-date",
    "codes",
    "beginner-guide",
    "walkthrough",
    "monster-tier-list",
    "map-and-locations",
    "story-and-ending",
    "updates-and-news",
  ];

  // 怪物卡片装饰图标（按 items 顺序：Orange, Green, Blue, Purple, Red）
  const monsterIcons: LucideIcon[] = [Zap, Footprints, Eye, Flame, AlertTriangle];
  // 地点卡片装饰图标（按 items 顺序：Pirate Ship, Sea Map, Upper Deck, Ship Interior, Odd World）
  const locationIcons: LucideIcon[] = [Ship, Waves, Compass, MapIcon, Route];

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Rainbow Friends Chapter 3 Wiki",
        description:
          "Track the Rainbow Friends Chapter 3 release status, official news, trailers, characters, theories, and complete Chapter 1 and Chapter 2 survival guides.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Rainbow Friends Chapter 3 - Roblox Mascot Horror",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Rainbow Friends Chapter 3 Wiki",
        alternateName: "Rainbow Friends Chapter 3",
        url: siteUrl,
        description:
          "Fan hub tracking the Rainbow Friends Chapter 3 release status, official news, trailers, characters, theories, and Chapter 1 & 2 survival guides.",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Rainbow Friends Chapter 3 Wiki - Roblox Mascot Horror",
        },
        sameAs: [
          "https://www.roblox.com/games/7991339063/Rainbow-Friends",
          "https://www.roblox.com/communities/1083606/roy-charcle",
          "https://roycharcle.com/",
          "https://x.com/royandcharcle",
          "https://www.youtube.com/@Official.RoyAndCharcle",
          "https://www.reddit.com/r/RainbowFriends/",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Rainbow Friends",
        gamePlatform: ["Roblox"],
        applicationCategory: "Game",
        genre: ["Horror", "Survival", "Adventure", "Story"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 50,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/7991339063/Rainbow-Friends",
        },
      },
      {
        "@type": "VideoObject",
        name: "The TRUTH About Rainbow Friends Chapter 3!",
        description:
          "Thinknoodles fact-checks the widely shared Rainbow Friends Chapter 3 release date rumors and trailers.",
        uploadDate: "2025-05-16",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/vSTZE1PK2d0",
        url: "https://www.youtube.com/watch?v=vSTZE1PK2d0",
      },
    ],
  };

  const mobileBannerAd = getPreferredMobileBannerSelection();
  const m = t.modules;

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 左/右侧 Social Bar 广告位已废弃，不再接回 */}
      {/* <aside>...</aside> */}

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <a
                href="https://roycharcle.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </a>
              <a
                href="https://www.roblox.com/games/7991339063/Rainbow-Friends"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero，容器宽度上限 max-w-5xl */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="vSTZE1PK2d0"
              title="The TRUTH About Rainbow Friends Chapter 3!"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards（前半屏收尾，锚点对应下方 8 个模块） */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = sectionIds[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                bg-[hsl(var(--nav-theme)/0.1)]
                                flex items-center justify-center
                                group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Release Date and Wishlist (info-cards) */}
      <section id="release-date" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={CalendarClock}
            eyebrow="Release Information"
            title={m.releaseDateAndWishlist.title}
            subtitle={m.releaseDateAndWishlist.subtitle}
          />
          <div className="scroll-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {m.releaseDateAndWishlist.items.map((item: any, index: number) => (
              <div
                key={index}
                className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <p className="text-xs uppercase tracking-wider text-[hsl(var(--nav-theme-light))] mb-2 font-semibold">
                  {item.label}
                </p>
                <p className="text-lg font-bold mb-2">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Codes (code-cards) */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Ticket}
            eyebrow="Redeem Codes"
            title={m.codes.title}
            subtitle={m.codes.subtitle}
          />
          <div className="scroll-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {m.codes.items.map((item: any, index: number) => (
              <div
                key={index}
                className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <code className="px-3 py-1.5 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm font-mono text-[hsl(var(--nav-theme-light))] break-all">
                    {item.code}
                  </code>
                </div>
                <div className="flex items-center justify-between mb-2 text-xs">
                  <span className="text-muted-foreground">Reward: {item.reward}</span>
                  <span className="px-2 py-1 rounded-full bg-white/5 border border-border">
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Beginner Guide (step-by-step) */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={BookOpen}
            eyebrow="Beginner Guide"
            title={m.beginnerGuide.title}
            subtitle={m.beginnerGuide.subtitle}
          />
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {m.beginnerGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-2.5">
                    {step.description}
                  </p>
                  <div className="flex items-start gap-2 text-xs md:text-sm bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)] rounded-lg p-2.5">
                    <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Tip: </span>
                      {step.tip}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Walkthrough (step-by-step with status) */}
      <section id="walkthrough" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={MapIcon}
            eyebrow="Walkthrough"
            title={m.walkthrough.title}
            subtitle={m.walkthrough.subtitle}
          />
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {m.walkthrough.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5 md:mb-2">
                    <h3 className="text-lg md:text-xl font-bold">{step.title}</h3>
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      <Clock className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                      {step.status}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 5: Monster Tier List (tier-grid) */}
      <section id="monster-tier-list" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Skull}
            eyebrow="Monster Guide"
            title={m.monsterTierList.title}
            subtitle={m.monsterTierList.subtitle}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {m.monsterTierList.items.map((item: any, index: number) => {
              const Icon = monsterIcons[index] || Skull;
              return (
                <div
                  key={index}
                  className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.4)] text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                        {item.tier}
                      </span>
                      <h3 className="text-xl font-bold">{item.name}</h3>
                    </div>
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 mb-3 text-xs">
                    <p>
                      <span className="text-muted-foreground">Danger: </span>
                      <span className="font-semibold">{item.danger}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Speed: </span>
                      <span className="font-semibold">{item.speed}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Detection: </span>
                      <span className="font-semibold">{item.detection}</span>
                    </p>
                  </div>
                  <div className="space-y-1.5 text-sm mt-auto">
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Warning: </span>
                      {item.warningSigns}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Behavior: </span>
                      {item.behavior}
                    </p>
                    <p className="text-[hsl(var(--nav-theme-light))]">
                      <span className="font-semibold">Counter: </span>
                      {item.counterStrategy}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module 6: Map and Locations (card-list) */}
      <section id="map-and-locations" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Compass}
            eyebrow="Map Guide"
            title={m.mapAndLocations.title}
            subtitle={m.mapAndLocations.subtitle}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {m.mapAndLocations.items.map((item: any, index: number) => {
              const Icon = locationIcons[index] || Compass;
              const isFeature = index === 0;
              return (
                <div
                  key={index}
                  className={`p-6 border rounded-xl transition-colors flex flex-col ${
                    isFeature
                      ? "md:col-span-2 bg-[hsl(var(--nav-theme)/0.08)] border-[hsl(var(--nav-theme)/0.3)]"
                      : "bg-white/5 border-border hover:border-[hsl(var(--nav-theme)/0.5)]"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)]">
                      <Icon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`${isFeature ? "text-2xl" : "text-lg"} font-bold`}>
                        {item.name}
                      </h3>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{item.features}</p>
                  <p className="text-sm mb-3">
                    <span className="font-semibold">Routes: </span>
                    <span className="text-muted-foreground">{item.routeUse}</span>
                  </p>
                  <div className="mt-auto flex items-start gap-2 text-xs bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)] rounded-lg p-2.5">
                    <Flame className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Survival: </span>
                      {item.survivalTip}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module 7: Story and Ending (timeline) */}
      <section id="story-and-ending" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Clapperboard}
            eyebrow="Story Recap"
            title={m.storyAndEnding.title}
            subtitle={m.storyAndEnding.subtitle}
          />
          <div className="scroll-reveal relative pl-8 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-5">
            {m.storyAndEnding.items.map((item: any, index: number) => {
              const isChapter3 = String(item.stage).includes("Chapter 3");
              return (
                <div key={index} className="relative">
                  <div className="absolute -left-[2.15rem] w-5 h-5 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">{index + 1}</span>
                  </div>
                  <div
                    className={`p-5 border rounded-xl ${
                      isChapter3
                        ? "bg-[hsl(var(--nav-theme)/0.08)] border-[hsl(var(--nav-theme)/0.3)]"
                        : "bg-white/5 border-border"
                    }`}
                  >
                    <span className="inline-block text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] uppercase tracking-wider mb-2 font-semibold">
                      {item.stage}
                    </span>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{item.summary}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.keyCharacters.map((c: string, ci: number) => (
                        <span
                          key={ci}
                          className="text-xs px-2 py-1 rounded-md bg-white/5 border border-border text-muted-foreground"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module 8: Updates and News (news-grid) */}
      <section id="updates-and-news" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Newspaper}
            eyebrow="Latest News"
            title={m.updatesAndNews.title}
            subtitle={m.updatesAndNews.subtitle}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {m.updatesAndNews.items.map((item: any, index: number) => (
              <a
                key={index}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors group flex flex-col ${
                  index === 0 ? "lg:col-span-2" : ""
                }`}
              >
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] font-medium">
                    {item.phase}
                  </span>
                  <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    <Newspaper className="w-3 h-3" />
                    {item.contentType}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-[hsl(var(--nav-theme-light))] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 flex-1">{item.summary}</p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[hsl(var(--nav-theme-light))]">
                  Watch on YouTube
                  <ExternalLink className="w-3 h-3" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Updates Section（模板1 Latest Updates 模块，保留） */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={12} />

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.reddit.com/r/RainbowFriends/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.reddit}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/royandcharcle"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/communities/1083606/roy-charcle"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/games/7991339063/Rainbow-Friends"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxGame}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
