"use client"

import { useState, useEffect } from "react"

export function useCounter(end: number, duration = 1000, start = 0) {
  const [count, setCount] = useState(start)

  useEffect(() => {
    if (end === start) return

    let startTime: number | null = null
    let animationFrame: number

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      setCount(Math.floor(progress * (end - start) + start))

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step)
      }
    }

    animationFrame = window.requestAnimationFrame(step)

    return () => {
      window.cancelAnimationFrame(animationFrame)
    }
  }, [end, duration, start])

  return count
}
