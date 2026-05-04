use std::fs;
use std::path::PathBuf;
use anyhow::Result;
use crate::models::DocsMap;

pub fn load_docs_map(config_dir: &PathBuf) -> DocsMap {
    let path = config_dir.join("docs.json");
    fs::read_to_string(&path)
        .ok()
        .and_then(|c| serde_json::from_str(&c).ok())
        .unwrap_or_else(|| DocsMap {
            next_id: 1,
            docs: std::collections::HashMap::new(),
        })
}

pub fn save_docs_map(config_dir: &PathBuf, map: &DocsMap) -> Result<()> {
    fs::write(config_dir.join("docs.json"), serde_json::to_string_pretty(map)?)?;
    Ok(())
}

pub fn get_doc_content(docs_dir: &PathBuf, filename: &str) -> String {
    fs::read_to_string(docs_dir.join(filename)).unwrap_or_else(|_| "# 文档内容丢失".to_string())
}

pub fn save_doc_content(docs_dir: &PathBuf, filename: &str, content: &str) -> Result<()> {
    fs::write(docs_dir.join(filename), content)?;
    Ok(())
}

pub fn now_ms() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis() as u64
}
