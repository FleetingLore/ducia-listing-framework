import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import DocHeader from '../components/DocHeader'
import DocFooter from '../components/DocFooter'
import DeprecatedBanner from '../components/DeprecatedBanner'

export default function DocPage({ doc, isAdmin, onDownload, onDeprecate, onDelete, onHome }) {
  const [content, setContent] = useState(doc.content || '')
  
  // 如果 doc 有内容直接使用，没有则显示等待
  useEffect(() => {
    if (doc.content) {
      setContent(doc.content)
    }
  }, [doc.content])

  return (
    <div>
      <DocHeader title={doc.title} isAdmin={isAdmin} onHome={onHome} onDownload={onDownload} />
      <main className="main-content">
        {doc.deprecated && <DeprecatedBanner onRestore={onDeprecate} />}
        <div className="markdown-body">
          {content ? (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {content}
            </ReactMarkdown>
          ) : (
            <div style={{ opacity: 0.5 }}>加载中...</div>
          )}
        </div>
        <DocFooter 
          createdAt={doc.created_at} 
          isAdmin={isAdmin} 
          onDelete={onDelete} 
          onDeprecate={onDeprecate} 
          isDeprecated={doc.deprecated} 
        />
      </main>
    </div>
  )
}
