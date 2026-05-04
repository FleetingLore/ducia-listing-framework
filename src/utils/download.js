export function downloadDoc(doc) {
  if (!doc) return
  const blob = new Blob([doc.content], { type: "text/markdown" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${doc.title}.md`
  a.click()
  URL.revokeObjectURL(url)
}
