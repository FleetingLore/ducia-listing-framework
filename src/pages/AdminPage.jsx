import React, { useState, useEffect } from 'react'

export default function AdminPage({ onSuccess }) {
  const [sequence, setSequence] = useState([])
  const [userInput, setUserInput] = useState([])
  const [clickCounts, setClickCounts] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/sequence')
      .then(res => res.json())
      .then(data => {
        if (data.sequence?.length) setSequence(data.sequence)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleClick = async (num) => {
    const newCount = (clickCounts[num] || 0) + 1
    setClickCounts(prev => ({ ...prev, [num]: newCount }))
    
    if (!sequence.length) return
    
    const newInput = [...userInput, num]
    setUserInput(newInput)
    
    const seqStr = sequence.join(',')
    const inputStr = newInput.join(',')
    
    if (inputStr.endsWith(seqStr)) {
      const res = await fetch('/api/admin/session', { method: 'POST' })
      const data = await res.json()
      if (data.token) {
        onSuccess(data.token)
      }
    } else if (!seqStr.startsWith(inputStr)) {
      setUserInput([])
    }
  }

  if (loading) return <div>加载中...</div>

  const getStyle = (num) => {
    const count = clickCounts[num] || 0
    // 未点击：黑边 + 半透明黑
    if (count === 0) {
      return {
        backgroundColor: 'rgba(31, 35, 40, 0.3)',
        border: '2px solid #1f2328'
      }
    }
    // 奇数次：蓝边 + 半透明蓝
    if (count % 2 === 1) {
      return {
        backgroundColor: 'rgba(144, 223, 223, 0.3)',
        border: '2px solid #90DFDF'
      }
    }
    // 偶数次：黑边 + 半透明黑
    return {
      backgroundColor: 'rgba(31, 35, 40, 0.3)',
      border: '2px solid #1f2328'
    }
  }

  return (
    <div>
      <div className="rust-header">
        <div className="rust-header-left">
          <button className="rust-icon-btn" onClick={() => window.location.href = '/'}>
            <img src="/icons/home.svg" alt="Home" width="20" height="20" />
          </button>
        </div>
        <div className="rust-header-center">
          <span>Configuration</span>
        </div>
        <div className="rust-header-right">
          <div style={{ width: '40px' }}></div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 56px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 60px)', gap: '20px' }}>
          {[2, 1, 3, 4].map(pos => (
            <button
              key={pos}
              onClick={() => handleClick(pos)}
              style={{
                width: '60px',
                height: '60px',
                cursor: 'pointer',
                transition: 'all 0.1s',
                ...getStyle(pos)
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
