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

  // Scroll active tab into view when it changes
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

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const currentIndex = tabs.findIndex(t => t.label === activeTab)
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1].label)
      }
    },
    onSwipedRight: () => {
      const currentIndex = tabs.findIndex(t => t.label === activeTab)
      if (currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1].label)
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
    delta: 100,
  })

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      {/* Tabs List Container */}
      <div className="relative">
        <TabsList 
          ref={tabsListRef}
          className="flex lg:grid lg:grid-cols-4 w-full overflow-x-auto lg:overflow-visible bg-transparent gap-0 lg:gap-0 p-0 h-auto justify-start lg:justify-stretch border-b border-gray-200 scrollbar-hide"
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
                transition-all duration-200
                border-b-2 border-transparent
                text-muted-foreground
                hover:text-foreground
                data-[state=active]:border-blue-500
                data-[state=active]:text-blue-600
                data-[state=active]:font-semibold
                rounded-t-md
                flex-1 lg:flex-none
                min-w-fit
              `}
            >
              {tab.icon}
              <span className="truncate">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {/* Animated active indicator line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200" />
      </div>

      {/* Content Area with Swipe - More spacing added */}
      <div {...handlers} className="relative mt-10 lg:mt-12 min-h-[400px]">
        {tabsWithIcons.map((tab) => (
          <TabsContent 
            key={tab.label} 
            value={tab.label} 
            className="mt-0 border-0 p-0 focus-visible:outline-none focus-visible:ring-0 data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:slide-in-from-bottom-2 data-[state=active]:duration-300"
          >
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {tab.content}
            </div>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  )
}