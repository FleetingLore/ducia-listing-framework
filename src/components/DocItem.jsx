import React from 'react'

export default function DocItem({ cat, onClick }) {
  return (
    <div className="doc-item" onClick={onClick}>
      <span className="doc-item-title">{cat.title}</span>
      <span className="doc-item-date">{new Date(cat.created_at).toLocaleString()}</span>
    </div>
  )
}
