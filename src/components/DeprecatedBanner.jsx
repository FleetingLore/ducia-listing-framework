import React from 'react'

export default function DeprecatedBanner({ onRestore }) {
  return (
    <div className="deprecated-banner">
      <span className="deprecated-banner-text">此文档已弃用</span>
      <button className="deprecated-banner-button" onClick={onRestore}>
        恢复
      </button>
    </div>
  )
}
