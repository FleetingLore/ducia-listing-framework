import { useState, useEffect, useRef } from 'react'

export function useStickyHeader() {
  const [isSticky, setIsSticky] = useState(false)
  const [translateY, setTranslateY] = useState(0)
  const headerRef = useRef(null)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          const headerHeight = headerRef.current?.offsetHeight || 56
          
          // 固定逻辑
          if (scrollTop > headerHeight) {
            setIsSticky(true)
          } else {
            setIsSticky(false)
            setTranslateY(0)
            lastScrollY.current = scrollTop
            ticking.current = false
            return
          }
          
          // 滚动方向控制 translateY
          const delta = scrollTop - lastScrollY.current
          if (delta > 5) {
            // 向下滚动，隐藏
            setTranslateY(-headerHeight)
          } else if (delta < -5) {
            // 向上滚动，显示
            setTranslateY(0)
          }
          
          lastScrollY.current = scrollTop
          ticking.current = false
        })
        ticking.current = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { headerRef, isSticky, translateY }
}
