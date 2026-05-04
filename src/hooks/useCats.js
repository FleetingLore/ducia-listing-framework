import { useState, useEffect } from 'react'

export function useCats() {
  const [cats, setCats] = useState([])
  const [siteName, setSiteName] = useState("25 电科 3 班待办事项清单")
  const [loading, setLoading] = useState(true)

  const loadCats = async () => {
    const res = await fetch("/api/cats")
    const data = await res.json()
    if (data.success) {
      setCats(data.data)
      if (data.siteName) setSiteName(data.siteName)
    }
    setLoading(false)
  }

  useEffect(() => { loadCats() }, [])

  return { cats, siteName, loading: cats.length === 0 && loading, loadCats }
}
