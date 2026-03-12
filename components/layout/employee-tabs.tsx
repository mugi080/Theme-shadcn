"use client"

import * as React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useSwipeable } from "react-swipeable"
import {
  User, Users, GraduationCap, FileCheck,
  Briefcase, HeartHandshake, BookOpen, Info
} from "lucide-react"

type TabItem = {
  label: string
  content: React.ReactNode
  icon?: React.ReactNode
}

interface EmployeeTabsProps {
  tabs: TabItem[]
}

export function EmployeeTabs({ tabs }: EmployeeTabsProps) {
  const [activeTab, setActiveTab] = React.useState(tabs[0]?.label)
  const [indicatorStyle, setIndicatorStyle] = React.useState({ left: 0, width: 0 })
  const [animDir, setAnimDir] = React.useState<"left" | "right">("right")
  const [animKey, setAnimKey] = React.useState(0)

  const tabsListRef = React.useRef<HTMLDivElement>(null)
  const tabRefs = React.useRef<{ [key: string]: HTMLButtonElement | null }>({})

  const defaultIcons = [
    <User className="h-4 w-4 mr-2" />,
    <Users className="h-4 w-4 mr-2" />,
    <GraduationCap className="h-4 w-4 mr-2" />,
    <FileCheck className="h-4 w-4 mr-2" />,
    <Briefcase className="h-4 w-4 mr-2" />,
    <HeartHandshake className="h-4 w-4 mr-2" />,
    <BookOpen className="h-4 w-4 mr-2" />,
    <Info className="h-4 w-4 mr-2" />,
  ]

  const tabsWithIcons = tabs.map((tab, index) => ({
    ...tab,
    icon: tab.icon || defaultIcons[index] || defaultIcons[0],
  }))

  // Update indicator position whenever activeTab changes
  const updateIndicator = React.useCallback(() => {
    const el = tabRefs.current[activeTab]
    const container = tabsListRef.current
    if (el && container) {
      const containerRect = container.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      setIndicatorStyle({
        left: elRect.left - containerRect.left + container.scrollLeft,
        width: elRect.width,
      })
    }
  }, [activeTab])

  React.useEffect(() => {
    // Small delay to let layout settle
    const raf = requestAnimationFrame(updateIndicator)
    return () => cancelAnimationFrame(raf)
  }, [updateIndicator])

  // Scroll active tab into view
  React.useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab]
    if (activeTabElement && tabsListRef.current) {
      activeTabElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      })
    }
  }, [activeTab])

  const handleTabChange = (newTab: string) => {
    const currentIndex = tabs.findIndex(t => t.label === activeTab)
    const newIndex = tabs.findIndex(t => t.label === newTab)
    setAnimDir(newIndex > currentIndex ? "right" : "left")
    setAnimKey(k => k + 1)
    setActiveTab(newTab)
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const currentIndex = tabs.findIndex(t => t.label === activeTab)
      if (currentIndex < tabs.length - 1) {
        handleTabChange(tabs[currentIndex + 1].label)
      }
    },
    onSwipedRight: () => {
      const currentIndex = tabs.findIndex(t => t.label === activeTab)
      if (currentIndex > 0) {
        handleTabChange(tabs[currentIndex - 1].label)
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
    delta: 100,
  })

  return (
    <>
      <style>{`
        @keyframes slideInFromRight {
          from { opacity: 0; transform: translateX(28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInFromLeft {
          from { opacity: 0; transform: translateX(-28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .tab-enter-right {
          animation: slideInFromRight 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .tab-enter-left {
          animation: slideInFromLeft 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .tabs-indicator {
          position: absolute;
          bottom: 0;
          height: 2px;
          background: #3b82f6;
          border-radius: 2px 2px 0 0;
          transition: left 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                      width 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: none;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        {/* Tabs List Container */}
        <div className="relative">
          <TabsList
            ref={tabsListRef}
            className="flex lg:grid lg:grid-cols-4 w-full overflow-x-auto lg:overflow-visible bg-transparent gap-0 p-0 h-auto justify-start lg:justify-stretch scrollbar-hide"
          >
            {tabsWithIcons.map((tab) => (
              <TabsTrigger
                key={tab.label}
                value={tab.label}
                ref={(el) => { tabRefs.current[tab.label] = el }}
                className={`
                  inline-flex items-center justify-center
                  px-3 lg:px-4 py-3 text-sm font-medium
                  whitespace-nowrap
                  transition-colors duration-200
                  border-0 outline-none shadow-none
                  bg-transparent
                  rounded-none
                  text-muted-foreground
                  hover:text-foreground
                  data-[state=active]:text-blue-600
                  data-[state=active]:font-semibold
                  data-[state=active]:bg-transparent
                  data-[state=active]:shadow-none
                  flex-1 lg:flex-none
                  min-w-fit
                  pb-3
                `}
              >
                {tab.icon}
                <span className="truncate">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Bottom border line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200" />

          {/* Animated active indicator */}
          <div
            className="tabs-indicator"
            style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          />
        </div>

        {/* Content Area with Swipe */}
        <div {...handlers} className="relative mt-10 lg:mt-12 min-h-[400px] overflow-hidden">
          {tabsWithIcons.map((tab) => (
            <TabsContent
              key={tab.label}
              value={tab.label}
              className="mt-0 border-0 p-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <div
                key={`${tab.label}-${animKey}`}
                className={activeTab === tab.label
                  ? (animDir === "right" ? "tab-enter-right" : "tab-enter-left")
                  : ""}
              >
                {tab.content}
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </>
  )
}