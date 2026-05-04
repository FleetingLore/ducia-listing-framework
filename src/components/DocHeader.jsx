import React from 'react'

export default function DocHeader({ title, isAdmin, onHome, onDownload }) {
  return (
    <div className="rust-header">
      <div className="rust-header-left">
        <button className="rust-icon-button" onClick={onHome} title="返回主页">
          <svg width="18" height="18" viewBox="0 0 448 512" fill="currentColor">
            <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/>
          </svg>
        </button>
      </div>
      
      <div className="rust-header-center">
        <h1>{title}</h1>
      </div>
      
      <div className="rust-header-right">
        <button className="rust-icon-button" onClick={onDownload} title="下载文档">
          <svg width="16" height="16" viewBox="0 0 384 512" fill="currentColor">
            <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
