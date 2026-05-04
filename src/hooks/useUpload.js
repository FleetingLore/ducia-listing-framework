export function useUpload(loadCats) {
  const upload = async (e) => {
    const file = e.target.files[0]
    if (!file || !file.name.endsWith('.md')) {
      alert("请上传 .md 文件")
      return
    }
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const content = ev.target.result
      const title = file.name.slice(0, -3)
      await fetch("/api/cats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
      })
      loadCats()
    }
    reader.readAsText(file)
    e.target.value = ""
  }
  return { upload }
}
