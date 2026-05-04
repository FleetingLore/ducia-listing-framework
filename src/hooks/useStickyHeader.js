import { useState, useEffect, useRef } from 'react'

export function useStickyHeader() {
  const [isSticky, setIsSticky] = useState(false)
  const headerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect()
        // 当 header 滚动到顶部时，固定它
        setIsSticky(rect.top <= 0)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { headerRef, isSticky }
}
