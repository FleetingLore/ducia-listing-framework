import React from 'react'

export default function Header({ siteName, isAdmin, onAdminClick, onUpload }) {
  const iconSrc = isAdmin ? '/icons/user.svg' : '/icons/home.svg'
  
  return (
    <header className="header">
      <button className="icon-button" onClick={onAdminClick}>
        <img src={iconSrc} alt={isAdmin ? "Admin" : "Home"} />
      </button>
      <h1 className="header-title">{siteName}</h1>
      <label className="icon-button" style={{ cursor: "pointer" }}>
        <img src="/icons/upload.svg" alt="Upload" />
        <input type="file" accept=".md" onChange={onUpload} style={{ display: "none" }} />
      </label>
    </header>
  )
}
