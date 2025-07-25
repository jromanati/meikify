"use client"

import { useEffect, useRef } from "react"
import { useAnalytics } from "@/hooks/use-analytics"

interface ScrollTrackerProps {
  sections: string[]
  thresholds?: number[]
}

export function ScrollTracker({ sections, thresholds = [25, 50, 75, 90, 100] }: ScrollTrackerProps) {
  const analytics = useAnalytics()
  const trackedSections = useRef<Set<string>>(new Set())
  const trackedThresholds = useRef<Map<string, Set<number>>>(new Map())

  useEffect(() => {
    // Initialize the map of tracked thresholds for each section
    sections.forEach((section) => {
      trackedThresholds.current.set(section, new Set())
    })

    const handleScroll = () => {
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId)
        if (!element) return

        const rect = element.getBoundingClientRect()
        const windowHeight = window.innerHeight || document.documentElement.clientHeight

        // Verify if the section is visible (at least 25%)
        const isVisible = rect.top <= windowHeight * 0.75 && rect.bottom >= windowHeight * 0.25

        // Track section view (only once)
        if (isVisible && !trackedSections.current.has(sectionId)) {
          trackedSections.current.add(sectionId)
          analytics.trackSectionView(sectionId)
        }

        // Calculate the percentage of the section that is visible
        const sectionHeight = rect.height
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0)
        const visiblePercentage = Math.round((visibleHeight / sectionHeight) * 100)

        // Track scroll thresholds
        thresholds.forEach((threshold) => {
          const thresholdsForSection = trackedThresholds.current.get(sectionId)
          if (visiblePercentage >= threshold && thresholdsForSection && !thresholdsForSection.has(threshold)) {
            thresholdsForSection.add(threshold)
            analytics.trackScrollDepth(sectionId, threshold)
          }
        })
      })
    }

    // Execute once on load to capture already visible sections
    handleScroll()

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections, thresholds, analytics])

  return null
}
