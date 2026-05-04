import React, { useState, useEffect, useRef } from 'react'

export default function AdminPage({ onSuccess }) {
  const [sequence, setSequence] = useState([])
  const [userInput, setUserInput] = useState([])
  const [toggledBlocks, setToggledBlocks] = useState({})
  const [loading, setLoading] = useState(true)
  const timeoutRef = useRef(null)

  useEffect(() => {
    fetch('/api/admin/sequence')
      .then(res => res.json())
      .then(data => {
        if (data.sequence?.length) setSequence(data.sequence)
        setLoading(false)
      })
      .catch(() => setLoading(false))
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [])

  const handleClick = async (num) => {
    // 切换方块状态（蓝色/透明）
    setToggledBlocks(prev => ({
      ...prev,
      [num]: !prev[num]
    }))
    
    // 150ms 后自动变回透明
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setToggledBlocks(prev => ({
        ...prev,
        [num]: false
      }))
    }, 150)
    
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

  const getBlockStyle = (num) => ({
    width: '48px',
    height: '48px',
    border: '2px solid #1f2328',
    backgroundColor: toggledBlocks[num] ? '#0969da' : 'transparent',
    transition: 'background-color 0.1s',
    cursor: 'pointer'
  })

  const blockContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 48px)',
    gap: '16px',
    justifyContent: 'center',
    alignItems: 'center'
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
          {/* 右边空白占位 */}
          <div style={{ width: '40px' }}></div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 56px)' }}>
        <div style={blockContainerStyle}>
          <button style={getBlockStyle(2)} onClick={() => handleClick(2)} />
          <button style={getBlockStyle(1)} onClick={() => handleClick(1)} />
          <button style={getBlockStyle(3)} onClick={() => handleClick(3)} />
          <button style={getBlockStyle(4)} onClick={() => handleClick(4)} />
        </div>
      </div>
    </div>
  )
}
