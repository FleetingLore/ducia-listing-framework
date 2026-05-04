use actix_web::{HttpResponse, Responder, web, HttpRequest};
use std::sync::Mutex;
use std::collections::HashMap;
use uuid::Uuid;
use once_cell::sync::Lazy;
use crate::config;
use crate::AppState;

static SESSIONS: Lazy<Mutex<HashMap<String, bool>>> = Lazy::new(|| Mutex::new(HashMap::new()));

pub async fn get_sequence(
    state: web::Data<Mutex<AppState>>,
) -> impl Responder {
    let state = state.lock().unwrap();
    let seq = config::load_admin_sequence(&state.config_dir);
    HttpResponse::Ok().json(serde_json::json!({ "sequence": seq }))
}

pub async fn create_session() -> impl Responder {
    let token = Uuid::new_v4().to_string();
    SESSIONS.lock().unwrap().insert(token.clone(), true);
    HttpResponse::Ok().json(serde_json::json!({ "token": token }))
}

pub async fn check_session(req: HttpRequest) -> impl Responder {
    let token = req.headers()
        .get("X-Session-Token")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");
    
    let sessions = SESSIONS.lock().unwrap();
    let is_admin = sessions.contains_key(token);
    
    HttpResponse::Ok().json(serde_json::json!({ "isAdmin": is_admin }))
}

pub async fn destroy_session(req: HttpRequest) -> impl Responder {
    let token = req.headers()
        .get("X-Session-Token")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");
    
    let mut sessions = SESSIONS.lock().unwrap();
    sessions.remove(token);
    
    HttpResponse::Ok().json(serde_json::json!({ "success": true }))
}
