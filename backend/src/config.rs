use std::fs;
use std::path::PathBuf;

pub fn load_site_name(config_dir: &PathBuf) -> String {
    let path = config_dir.join("site.json");
    if let Ok(content) = fs::read_to_string(&path) {
        if let Ok(json) = serde_json::from_str::<serde_json::Value>(&content) {
            if let Some(name) = json.get("name").and_then(|n| n.as_str()) {
                return name.to_string();
            }
        }
    }
    "Ducia".to_string()
}

pub fn load_admin_sequence(config_dir: &PathBuf) -> Vec<usize> {
    let path = config_dir.join("sequence.json");
    if let Ok(content) = fs::read_to_string(&path) {
        if let Ok(json) = serde_json::from_str::<serde_json::Value>(&content) {
            if let Some(arr) = json.get("sequence").and_then(|s| s.as_array()) {
                let seq: Vec<usize> = arr
                    .iter()
                    .filter_map(|v| v.as_u64())
                    .map(|v| v as usize)
                    .collect();
                if !seq.is_empty() {
                    return seq;
                }
            }
        }
    }
    // 如果文件不存在或格式错误，返回空数组
    Vec::new()
}
