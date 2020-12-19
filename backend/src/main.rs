use std::sync::Mutex;
use serde::{Serialize};
use actix_web::{get, web, App, HttpServer, Responder};

struct AppStateWithCounter {
    counter: Mutex<i32>,
}

#[derive(Serialize, Debug)]
struct Balance {
    date: String,
    balances: Vec<f32>,
}

#[derive(Serialize, Debug)]
struct AccountNames {
    names: Vec<String>,
}

#[derive(Serialize, Debug)]
struct AccountData {
    account_names: AccountNames,
    balances: Vec<Balance>,
}


#[get("/account_data")]
async fn account_data() -> impl Responder {
    let account_names = AccountNames{names: vec![String::from("bank a"), String::from("bank b"), String::from("bank c")]};
    let balance1 = Balance {date: String::from("May 2018"), balances: vec![1.3, 5.6, 7.8]};
    let balance2 = Balance {date: String::from("June 2018"), balances: vec![-0.3, 2.1, 4.0]};

    let current_balance = AccountData{account_names: account_names, balances: vec![balance1, balance2]};
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
        App::new()
            .app_data(counter.clone())
            .service(account_data)
            .route("/index", web::get().to(index))
    })
    .bind("127.0.0.1:8081")?
    .run()
    .await
}
