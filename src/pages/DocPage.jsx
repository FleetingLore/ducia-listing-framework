import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import DocHeader from '../components/DocHeader'
import DocFooter from '../components/DocFooter'
import DeprecatedBanner from '../components/DeprecatedBanner'

export default function DocPage({ doc, isAdmin, onDownload, onDeprecate, onDelete, onHome }) {
  return (
    <div>
      <DocHeader title={doc.title} isAdmin={isAdmin} onHome={onHome} onDownload={onDownload} />
      <main className="main-content">
        {doc.deprecated && <DeprecatedBanner onRestore={onDeprecate} />}
        <div className="markdown-body">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {doc.content}
          </ReactMarkdown>
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
