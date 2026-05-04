import React from 'react'
import { useStickyHeader } from '../hooks/useStickyHeader'

export default function Header({ siteName, isAdmin, onAdminClick, onUpload }) {
  const { headerRef, isSticky } = useStickyHeader()
  const iconSrc = isAdmin ? '/icons/user.svg' : '/icons/home.svg'
  
  return (
    <div ref={headerRef} className={`menu-bar ${isSticky ? 'sticky' : ''}`}>
      <div className="left-buttons">
        <button className="icon-button" onClick={onAdminClick}>
          <img src={iconSrc} alt={isAdmin ? "Admin" : "Home"} width="20" height="20" />
        </button>
      </div>
      <h1 className="menu-title">{siteName}</h1>
      <div className="right-buttons">
        <label className="icon-button" style={{ cursor: "pointer" }}>
          <img src="/icons/upload.svg" alt="Upload" width="18" height="18" />
          <input type="file" accept=".md" onChange={onUpload} style={{ display: "none" }} />
        </label>
      </div>
    </div>
  )
}
