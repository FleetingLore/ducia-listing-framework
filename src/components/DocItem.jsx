import React, { useState } from 'react'
import { prefetchDoc } from '../utils/prefetch'

export default function DocItem({ cat, onClick }) {
  const [hover, setHover] = useState(false)
  
  const handleMouseEnter = () => {
    setHover(true)
    // 预加载文档内容
    prefetchDoc(cat.id)
  }
  
  return (
    <div 
      className="doc-item" 
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHover(false)}
    >
      <span className="doc-item-title">{cat.title}</span>
      <span className="doc-item-date">
        {new Date(cat.created_at).toLocaleString()}
      </span>
    </div>
  )
}
