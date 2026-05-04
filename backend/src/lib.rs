pub mod config;
pub mod db;
pub mod handlers;
pub mod models;

use actix_cors::Cors;
use actix_web::{App, HttpServer, web};
use std::path::PathBuf;
use std::sync::Mutex;

pub struct AppState {
    pub config_dir: PathBuf,
    pub docs_dir: PathBuf,
}

pub async fn run_server(
    bind_addr: &str,
    config_dir: PathBuf,
    docs_dir: PathBuf,
) -> std::io::Result<()> {
    std::fs::create_dir_all(&config_dir)?;
    std::fs::create_dir_all(&docs_dir)?;

    let state = web::Data::new(Mutex::new(AppState {
        config_dir,
        docs_dir,
    }));

    println!("Server on http://{}", bind_addr);

    HttpServer::new(move || {
        App::new()
            .wrap(Cors::permissive())
            .app_data(state.clone())
            .route("/api/cats", web::get().to(handlers::list::list_cats))
            .route("/api/cats/{id}", web::get().to(handlers::get::get_cat))
            .route("/api/cats", web::post().to(handlers::upload::upload_cat))
            .route(
                "/api/cats/{id}/deprecated",
                web::put().to(handlers::deprecated::set_deprecated),
            )
            .route(
                "/api/cats/{id}/deleted",
                web::put().to(handlers::delete::delete_cat),
            )
            .route(
                "/api/admin/sequence",
                web::get().to(handlers::admin::get_sequence),
            )
            .route(
                "/api/admin/session",
                web::post().to(handlers::admin::create_session),
            )
            .route(
                "/api/admin/session",
                web::get().to(handlers::admin::check_session),
            )
            .route(
                "/api/admin/session",
                web::delete().to(handlers::admin::destroy_session),
            )
    })
    .bind(bind_addr)?
    .run()
    .await
}
