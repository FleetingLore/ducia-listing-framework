import React, { useState } from 'react'

export default function DocFooter({ createdAt, isAdmin, onDelete, onDeprecate, isDeprecated }) {
  const [confirm, setConfirm] = useState(false)
  
  const handleDeleteClick = () => {
    if (confirm) { 
      onDelete() 
      setConfirm(false) 
    } else {
      setConfirm(true)
      setTimeout(() => setConfirm(false), 3000)
    }
  }
  
  return (
    <div className="doc-footer">
      {!isDeprecated && (
        <button className="action-button action-button-deprecate" onClick={onDeprecate}>
          标记弃用
        </button>
      )}
      {isDeprecated && isAdmin && (
        <button className="action-button action-button-delete" onClick={handleDeleteClick}>
          {confirm ? "确认删除" : "删除"}
        </button>
      )}
      {isDeprecated && !isAdmin && <div />}
      <div className="doc-footer-date">
        {new Date(createdAt).toLocaleString()}
      </div>
    </div>
  )
}
