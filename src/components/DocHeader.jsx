import React from 'react'

export default function DocHeader({ title, isAdmin, onHome, onDownload }) {
  const iconSrc = isAdmin ? '/icons/user.svg' : '/icons/home.svg'
  
  return (
    <header className="header">
      <button className="icon-button" onClick={onHome}>
        <img src={iconSrc} alt={isAdmin ? "Admin" : "Home"} />
      </button>
      <h1 className="header-title">{title}</h1>
      <button className="icon-button" onClick={onDownload}>
        <img src="/icons/download.svg" alt="Download" />
      </button>
    </header>
  )
}
