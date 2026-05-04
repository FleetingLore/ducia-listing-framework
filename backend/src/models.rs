use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DocMeta {
    pub title: String,
    pub file: String,
    pub created_at: u64,
    pub deprecated: bool,
    pub deleted: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DocsMap {
    pub next_id: u64,
    pub docs: HashMap<String, DocMeta>,
}

#[derive(Debug, Deserialize)]
pub struct CreateDocReq {
    pub title: String,
    pub content: String,
}

#[derive(Debug, Deserialize)]
pub struct DeprecatedReq {
    pub deprecated: bool,
}
