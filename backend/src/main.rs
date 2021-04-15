use actix_cors::Cors;
use actix_web::http::header;
use actix_web::{get, web, App, HttpServer, Responder};
use serde::Serialize;
use std::sync::Mutex;

struct AppStateWithCounter {
    counter: Mutex<i32>,
}

#[derive(Serialize, Debug)]
struct Balance {
    date: String,
    balances: Vec<f32>,
}

type AccountNames = Vec<String>;

#[derive(Serialize, Debug)]
struct AccountData {
    account_names: AccountNames,
    balances: Vec<Balance>,
}

#[get("/account_data")]
async fn account_data() -> impl Responder {
    let account_names = vec![
        String::from("bank a"),
        String::from("bank b"),
        String::from("bank c"),
    ];
    let balance1 = Balance {
        date: String::from("May 2018"),
        balances: vec![1.3, 5.6, 7.8],
    };
    let balance2 = Balance {
        date: String::from("June 2018"),
        balances: vec![-0.3, 2.1, 4.0],
    };

    let current_balance = AccountData {
        account_names: account_names,
        balances: vec![balance1, balance2],
    };
    let serialized = serde_json::to_string(&current_balance).unwrap();
    println!("serialized = {}", serialized);
    web::Json(current_balance)
}

async fn index(data: web::Data<AppStateWithCounter>) -> String {
    let mut counter = data.counter.lock().unwrap();
    *counter += 1;

    format!("Request number: {}", counter)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let counter = web::Data::new(AppStateWithCounter {
        counter: Mutex::new(0),
    });

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("http://localhost:4000")
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![header::AUTHORIZATION, header::ACCEPT])
            .allowed_header(header::CONTENT_TYPE)
            .max_age(3600);

        App::new()
            .wrap(cors)
            .app_data(counter.clone())
            .service(account_data)
            .route("/index", web::get().to(index))
    })
    .bind("127.0.0.1:8081")?
    .run()
    .await
}
