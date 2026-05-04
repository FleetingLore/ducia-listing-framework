import React from 'react'

export default function Header({ siteName, isAdmin, onAdminClick, onUpload }) {
  const iconSrc = isAdmin ? '/icons/user.svg' : '/icons/home.svg'
  
  return (
    <div className="rust-header">
      <div className="rust-header-left">
        <button className="rust-icon-button" onClick={onAdminClick}>
          <img src={iconSrc} alt={isAdmin ? "Admin" : "Home"} width="20" height="20" />
        </button>
      </div>
      <div className="rust-header-center">
        <h1>{siteName}</h1>
      </div>
      <div className="rust-header-right">
        <label className="rust-icon-button" style={{ cursor: "pointer" }}>
          <img src="/icons/upload.svg" alt="Upload" width="18" height="18" />
          <input type="file" accept=".md" onChange={onUpload} style={{ display: "none" }} />
        </label>
      </div>
    </div>
  )
}
