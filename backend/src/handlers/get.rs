use actix_web::{HttpResponse, Responder, web};
use std::sync::Mutex;
use crate::db;
use crate::AppState;

pub async fn get_cat(path: web::Path<String>, state: web::Data<Mutex<AppState>>) -> impl Responder {
    let id = path.into_inner();
    let state = state.lock().unwrap();
    let docs_map = db::load_docs_map(&state.config_dir);
    
    let doc = match docs_map.docs.get(&id) {
        Some(d) => d,
        None => return HttpResponse::NotFound().json(serde_json::json!({
            "success": false, "message": "文档不存在"
        })),
    };
    
    if doc.deleted {
        return HttpResponse::Gone().json(serde_json::json!({
            "success": false, "message": "文档已删除"
        }));
    }
    
    let content = db::get_doc_content(&state.docs_dir, &doc.file);
    
    HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "data": {
            "id": id,
            "title": doc.title,
            "content": content,
            "created_at": doc.created_at,
            "deprecated": doc.deprecated,
        }
    }))
}
