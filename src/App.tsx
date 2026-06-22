import React, { useEffect, useState, useCallback } from 'react'
import Listing from './pages/Listing'
import DocPage from './pages/DocPage'
import AdminPage from './pages/AdminPage'
import { useAdmin } from './hooks/useAdmin'
import { useCats } from './hooks/useCats'
import { useUpload } from './hooks/useUpload'
import { downloadDoc } from './utils/download'
import { getCachedDoc, prefetchDoc } from './utils/prefetch'
import type { DocFull, DocListItem } from './types'
import type { GetCatResponse, ListCatsResponse } from './types/api'

type View = 'loading' | 'listing' | 'doc' | 'admin'

function App() {
  const [view, setView] = useState<View>('loading')
  const { isAdmin, loading: adminLoading, createSession } = useAdmin()
  const { cats, siteName, loading: catsLoading, loadCats } = useCats()
  const [currentDoc, setCurrentDoc] = useState<DocFull | null>(null)
  const { upload } = useUpload(loadCats)

  useEffect(() => {
    const path = location.pathname
    if (path === '/' || path === '/listing') {
      setView('listing')
    } else if (path === '/listing/lib/0') {
      setView('admin')
    } else if (path.startsWith('/listing/lib/')) {
      const id = path.split('/').pop()!
      loadDocWithCache(id)
    }
  }, [])

  const loadDocWithCache = useCallback(async (id: string) => {
    let doc = getCachedDoc(id)
    if (doc) {
      setCurrentDoc(doc)
      setView('doc')
      return
    }

    setCurrentDoc({ id, title: '...', content: '', created_at: Date.now(), deprecated: false })
    setView('doc')

    try {
      const res = await fetch(`/api/cats/${id}`)
      const data: GetCatResponse = await res.json()
      if (data.success && data.data) {
        setCurrentDoc(data.data)
      } else {
        goHome()
      }
    } catch {
      goHome()
    }
  }, [])

  const loadCatsAndPrefetch = useCallback(async () => {
    const res = await fetch('/api/cats')
    const data: ListCatsResponse = await res.json()
    if (data.success && data.data) {
      const topDocs = data.data.slice(0, 5)
      topDocs.forEach((doc: DocListItem) => {
        prefetchDoc(doc.id)
      })
    }
  }, [])

  useEffect(() => {
    if (view === 'listing') {
      loadCatsAndPrefetch()
    }
  }, [view, loadCatsAndPrefetch])

  const goHome = () => { location.href = '/' }
  const goAdmin = () => { location.href = '/listing/lib/0' }
  const handleAdminSuccess = (token: string) => { createSession(token); goHome() }

  if (adminLoading || (view === 'listing' && catsLoading)) {
    return <div></div>
  }
  if (view === 'admin') {
    return <AdminPage onSuccess={handleAdminSuccess} />
  }
  if (view === 'listing') {
    return <Listing siteName={siteName} cats={cats} isAdmin={isAdmin} onUpload={upload} onAdminClick={goAdmin} />
  }
  if (view === 'doc' && currentDoc) {
    return (
      <DocPage
        doc={currentDoc}
        isAdmin={isAdmin}
        onDownload={() => downloadDoc(currentDoc)}
        onDeprecate={() => {
          fetch(`/api/cats/${currentDoc.id}/deprecated`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deprecated: !currentDoc.deprecated })
          })
          loadDocWithCache(currentDoc.id)
          loadCats()
        }}
        onDelete={() => {
          fetch(`/api/cats/${currentDoc.id}/deleted`, { method: 'PUT' }).then(() => goHome())
        }}
        onHome={goHome}
      />
    )
  }
  return <div></div>
}

export default App
