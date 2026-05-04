import React, { useState, useEffect, useRef } from 'react'

export default function AdminPage({ onSuccess }) {
  const [sequence, setSequence] = useState([])
  const [userInput, setUserInput] = useState([])
  const [lastClicked, setLastClicked] = useState(null)
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
    setLastClicked(num)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setLastClicked(null), 150)
    
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

  const getBlockClass = (pos) => {
    if (lastClicked === pos) return 'admin-block-highlight'
    const last = userInput[userInput.length - 1]
    if (last === pos) return 'admin-block-success'
    return 'admin-block-default'
  }

  return (
    <div>
      <div className="admin-header">
        <h2>Configuration</h2>
      </div>
      <div className="admin-container">
        <div className="admin-grid">
          <button className={`admin-block ${getBlockClass(2)}`} onClick={() => handleClick(2)} />
          <button className={`admin-block ${getBlockClass(1)}`} onClick={() => handleClick(1)} />
          <button className={`admin-block ${getBlockClass(3)}`} onClick={() => handleClick(3)} />
          <button className={`admin-block ${getBlockClass(4)}`} onClick={() => handleClick(4)} />
        </div>
      </div>
    </div>
  )
}
