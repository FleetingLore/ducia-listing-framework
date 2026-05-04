import { useState } from 'react'

export function useDoc(loadCats) {
  const [currentDoc, setCurrentDoc] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchDoc = async (id, onNotFound) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/cats/${id}`)
      const data = await res.json()
      if (data.success) {
        setCurrentDoc(data.data)
        setLoading(false)
        return true
      }
      onNotFound?.()
    } catch {
      onNotFound?.()
    }
    setLoading(false)
    return false
  }

  const toggleDeprecated = async (id) => {
    const doc = currentDoc
    if (!doc) return
    await fetch(`/api/cats/${id}/deprecated`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deprecated: !doc.deprecated })
    })
    // 重新获取文档以更新状态
    await fetchDoc(id)
    // 重新加载列表
    if (loadCats) loadCats()
  }

  const deleteDoc = async (id) => {
    const res = await fetch(`/api/cats/${id}/deleted`, { method: "PUT" })
    return res.ok
  }

  return { currentDoc, loading, fetchDoc, toggleDeprecated, deleteDoc }
}
