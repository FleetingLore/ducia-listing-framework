// 预加载文档内容
const cache = new Map()

export function prefetchDoc(id) {
  if (cache.has(id)) return cache.get(id)
  
  const promise = fetch(`/api/cats/${id}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        cache.set(id, data.data)
        return data.data
      }
      return null
    })
    .catch(() => null)
  
  cache.set(id, promise)
  return promise
}

export function getCachedDoc(id) {
  return cache.get(id)
}

export function clearCache() {
  cache.clear()
}
