import React from 'react'
import Header from '../components/Header'
import DocItem from '../components/DocItem'

export default function Listing({ siteName, cats, isAdmin, onUpload, onAdminClick }) {
  return (
    <div>
      <Header siteName={siteName} isAdmin={isAdmin} onAdminClick={onAdminClick} onUpload={onUpload} />
      <main className="main-content-wide">
        {!cats.length && <div className="empty-state">暂无文档，点击上传</div>}
        {cats.map(cat => <DocItem key={cat.id} cat={cat} onClick={() => location.href = `/listing/lib/${cat.id}`} />)}
      </main>
    </div>
  )
}
