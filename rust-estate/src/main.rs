use actix_cors::Cors;
use actix_web::{ delete, get, patch, post,
                web::{Data, Json, Path, Bytes}, App,
                HttpResponse, HttpServer, Responder, 
                middleware::Logger, dev::Payload, error::ErrorUnauthorized,
                http::{self, header::HeaderValue},
                Error as ActixWebError, FromRequest
            };
use serde::{ Deserialize, Serialize};
use std::{fs::File, future::{ ready, Ready }};
use validator::Validate;
use dotenv::dotenv;
use sqlx::{self, postgres::PgPoolOptions, Pool, Postgres, FromRow};
use jsonwebtoken::{ encode, decode,Algorithm, Header,
                    EncodingKey, DecodingKey, Validation,
                    TokenData, errors::Error as JwtError};
use chrono::{Utc, Duration};




//structs



pub struct AppState {
    db: Pool<Postgres>
}

#[derive(Serialize, Deserialize, Validate, FromRow)]
struct Client {
    #[validate(length(min = 1, message = "client name required"))]
    name: String,
    email: String,
    password1: String,
    password2: String,
    tours: Vec<i32>,
    id: i32,
}

#[derive(Serialize, Deserialize, Validate, FromRow)]
struct CreateClient {
    #[validate(length(min = 1, message = "client name required"))]
    name: String,
    email: String,
    password1: String,
    password2: String,
    tours: Vec<i32>,
}

#[derive(Serialize, Deserialize, Validate, FromRow)]
struct UpdateClient {
    #[validate(length(min = 1, message = "client name required"))]
    name: String,
    email: String,
    password1: String,
    password2: String,
}

#[derive(Serialize, Deserialize, FromRow)]
struct ClientTours {
    tours: Vec<i32>,
}


#[derive(Serialize, Deserialize, Validate, FromRow)]
struct Agent {
    #[validate(length(min = 1, message = "agent name required"))]
    name: String,
    email: String,
    password1: String,
    password2: String,
    contact: i32,
    listings: Vec<i32>,
    id: i32,
}

#[derive(Serialize, Deserialize, Validate, FromRow)]
struct UpdateAgent {
    #[validate(length(min = 1, message = "agent name required"))]
    name: String,
    email: String,
    password1: String,
    password2: String,
    contact: i32,
}

#[derive(Serialize, Deserialize, Validate, FromRow)]
struct CreateAgent {
    #[validate(length(min = 1, message = "agent name required"))]
    name: String,
    email: String,
    password1: String,
    password2: String,
    contact: i32,
    listings: Vec<i32>,
}

#[derive(Serialize, Deserialize, Validate, FromRow)]
struct Listing {
    #[validate(length(min = 1, message = "listing name required"))]
    name: String,
    location: String,
    price: i32,
    bedrooms: i32,
    visual_urls: Vec<String>,
    ownership: String,
    distance: i32,
    agent: i32,
    tours: i32,
    id: i32,
}

#[derive(Serialize, Deserialize, Validate, FromRow)]
struct UpdateListing {
    #[validate(length(min = 1, message = "listing name required"))]
    name: String,
    location: String,
    price: i32,
    bedrooms: i32,
    ownership: String,
    distance: i32,
}

#[derive(Serialize, Deserialize, Validate, FromRow)]
struct ListingVisual {
    visual_urls: Vec<String>,
}

#[derive(Serialize, Deserialize, FromRow)]
struct ListingTour {
    tours: i32,
}

#[derive(Serialize, Deserialize, Validate, FromRow)]
struct CreateListing {
    #[validate(length(min = 1, message = "listing name required"))]
    name: String,
    location: String,
    price: i32,
    bedrooms: i32,
    visual_urls: Vec<String>,
    ownership: String,
    distance: i32,
    tours: i32,
}

#[derive(Deserialize)]
pub struct ClientLogin {
    pub email: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct AgentLogin {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub id: i32,
    pub exp: usize,
}


#[derive(Serialize, Deserialize)]
struct ClientEncodedResponse {
    message: String,
    token: String,
    client: Client,
}


#[derive(Serialize, Deserialize)]
struct AgentEncodedResponse {
    message: String,
    token: String,
    agent: Agent,
}


#[derive(Serialize, Deserialize)]
struct DecodeToken {
    token: String
}

#[derive(Serialize, Deserialize)]
struct DecodedResponse {
    message: String,
    id: i32,
}

#[derive(Serialize, Deserialize)]
struct Response {
    message: String,
}


#[derive(Serialize, Deserialize)]
struct AuthenticationToken {
    id: i32,
}

impl FromRequest for AuthenticationToken {
    type Error = ActixWebError;
    type Future = Ready<Result<Self, Self::Error>>;

    fn from_request(req: &actix_web::HttpRequest, _: &mut Payload) -> Self::Future {
        //get auth token from authorization header
        let auth_header: Option<&HeaderValue> = req.headers().get(http::header::AUTHORIZATION);
        let auth_token: String = auth_header.unwrap().to_str().unwrap_or("").to_string();
        if auth_token.is_empty() { return ready(Err(ErrorUnauthorized("Invalid auth token!"))); }

        
        let secret: &str = &req.app_data::<Data<String>>().unwrap();

        //let decode token with the secret
        let decode: Result<TokenData<Claims>, JwtError> = decode::<Claims>(
            &auth_token.trim(),
            &DecodingKey::from_secret(secret.as_ref()),
            &Validation::new(Algorithm::HS256),
        );
        //return authentication token
        match decode {
            Ok(token)=> ready(Ok(AuthenticationToken { id: token.claims.id})),
            Err(e) => ready(Err(ErrorUnauthorized(e.to_string()))),
        }
    }
}





//fn main




#[actix_web::main]
async fn main() -> std::io::Result<()> {

    dotenv().ok();
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Error building a connection pool");

    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    HttpServer::new( move || { let cors = Cors::default()
    //.allowed_origin("http://localhost:3000")
    .allow_any_origin()
    .allowed_methods(vec!["GET", "POST", "PATCH", "DELETE"])
    //.allow_any_method()
    .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
    .allowed_header(http::header::CONTENT_TYPE)
    .max_age(3600);
        
        App::new()
        .wrap(Logger::default())
        .wrap(cors)
        .app_data(Data::new(AppState { db: pool.clone() }))
        .app_data(Data::new(String::from("secret")))
        .service(create_client)
        .service(login_client)
        .service(view_client)
        .service(view_client_tours)
        .service(client_add_tours)
        .service(client_remove_tours)
        .service(view_clients)
        .service(update_client)
        .service(delete_client)
        .service(decode_token)
        .service(protected)
        .service(create_agent)
        .service(login_agent)
        .service(view_agent)
        .service(view_agents)
        .service(update_agent)
        .service(delete_agent)
        .service(create_listing)
        .service(get_listings)
        .service(listing_visuals)//
        .service(add_listing_tours)
        .service(remove_listing_tours)
        .service(listing_visuals)
        .service(get_agent_listings)
        .service(listing_detail)
        .service(update_listing)
        .service(delete_listing)
        })
            .bind("127.0.0.1:8080")?
            .run()
            .await
}







// API fns



//Client functions
#[post("/create-client")]
async fn create_client(state: Data<AppState>, body: Json<CreateClient>) -> impl Responder {
    let is_valid = body.validate();

    match is_valid {
        Ok(_) => {
            match sqlx::query_as::<_, CreateClient>(
                "INSERT INTO clients (name, email, password1, password2, tours) VALUES ($1, $2, $3, $4, $5) RETURNING name, email, password1, password2, tours"
            )
                .bind(body.name.to_string())
                .bind(body.email.to_string())
                .bind(body.password1.to_string())
                .bind(body.password2.to_string())
                .bind(body.tours.clone())
                .fetch_one(&state.db)
                .await
            {
                Ok(client) => HttpResponse::Ok().json(client),
                Err(e) => HttpResponse::BadRequest().json( Response { message: e.to_string() }),
                //Err(e) => HttpResponse::InternalServerError().json("Failed to create client"),
            }
        }
        Err(_) => HttpResponse::Ok().body("Client name is requied!")
    }
    
}

#[post("/client/login")]
async fn login_client(state: Data<AppState>, login_data: Json<ClientLogin>, secret: Data<String>) -> impl Responder {
    let client = sqlx::query_as::<_, Client>(
        "SELECT * FROM clients WHERE email=$1"
    )
        .bind(&login_data.email)
        .fetch_one(&state.db)
        .await;

    match client {
        Ok(client) => {
            if &login_data.password == &client.password1 {
                let id: i32 = client.id;
                let exp: usize = (Utc::now() + Duration::minutes(30)).timestamp() as usize;
                let claims: Claims = Claims { id, exp };

                let token: String = encode(
                    &Header::default(),
                    &claims,
                    &EncodingKey::from_secret(secret.as_str().as_ref())
                ).unwrap();


                HttpResponse::Ok().json(ClientEncodedResponse {
                    message: "successfully created token".to_owned(),
                    token,
                    client
                })
            } else {
                HttpResponse::Unauthorized().finish()
            }
        }
        Err(_) => HttpResponse::Unauthorized().finish(),
    }
}

#[get("/clients")]
async fn view_clients(state: Data<AppState>, auth_token: AuthenticationToken) -> impl Responder {
    
    match sqlx::query_as::<_, Client>(
        "SELECT * FROM clients"
    )
        .fetch_all(&state.db)
        .await
    {
        Ok(client) => HttpResponse::Ok().json(client),
        Err(e) => HttpResponse::BadRequest().json( Response { message: e.to_string() }),
        //Err(_) => HttpResponse::InternalServerError().json("Failed to get clients"),
    }
}

#[get("/client/{id}")]
async fn view_client(state: Data<AppState>, id: Path<i32>, auth_token: AuthenticationToken) -> impl Responder {
    let id: i32 = id.into_inner();
    
    match sqlx::query_as::<_, Client>(
        "SELECT * FROM clients WHERE id = $1"
    )
        .bind(id)
        .fetch_one(&state.db)
        .await
    {
        Ok(client) => HttpResponse::Ok().json(client),
        Err(e) => HttpResponse::BadRequest().json( Response { message: e.to_string() }),
    }
}

#[get("/client/{id}/tours")]
async fn view_client_tours(state: Data<AppState>, id: Path<i32>) -> impl Responder {
    let id: i32 = id.into_inner();
    
    match sqlx::query_as::<_, Listing>(
        "SELECT * FROM listings
        WHERE id IN (SELECT unnest(array (SELECT tours from clients where id = $1)))"

    )
        .bind(id)
        .fetch_all(&state.db)
        .await
    {
        Ok(listing) => HttpResponse::Ok().json(listing),
        Err(e) => HttpResponse::BadRequest().json( Response { message: e.to_string() }),
    }
}

#[patch("/updateclient/{id}")]
async fn update_client(state: Data<AppState>, body: Json<UpdateClient>, id: Path<i32>) -> impl Responder {
    let id: i32 = id.into_inner();

    let is_valid = body.validate();

    match is_valid {
        Ok(_) => {
            match sqlx::query_as::<_, UpdateClient>(
                "UPDATE clients SET name = $1, email= $2, password1 = $3, password2 = $4 WHERE id = $5 RETURNING name, email, password1, password2"
            )
                .bind(body.name.to_string())
                .bind(body.email.to_string())
                .bind(body.password1.to_string())
                .bind(body.password2.to_string())
                .bind(id)
                .fetch_one(&state.db)
                .await
            {
                Ok(client) => HttpResponse::Ok().json(client),
                Err(e) => HttpResponse::BadRequest().json( Response { message: e.to_string() }),
            }
        }
        Err(_) => HttpResponse::Ok().body("Client name is requied!")
    }
}


//add listing to tours
#[patch("/client-tours-add/{id}")]
async fn client_add_tours(state: Data<AppState>, body: Json<ClientTours>, id: Path<i32>) -> impl Responder {
    let id: i32 = id.into_inner();

    match sqlx::query_as::<_, ClientTours>(
        "UPDATE clients SET tours = tours || $1 WHERE id = $2 RETURNING tours"
    )
        .bind(body.tours.clone())
        .bind(id)
        .fetch_one(&state.db)
        .await
    {
        Ok(client) => HttpResponse::Ok().json(client),
        Err(e) => HttpResponse::BadRequest().json( Response { message: e.to_string() }),
    }
}

#[patch("/client-tours-remove/{id}")]
async fn client_remove_tours(state: Data<AppState>, body: Json<ClientTours>, id: Path<i32>) -> impl Responder {
    let id: i32 = id.into_inner();

    match sqlx::query_as::<_, ClientTours>(
        //"UPDATE clients SET tours = array_remove(tours, $1)  WHERE id = $2 RETURNING tours"
        "UPDATE clients SET tours = array(
            SELECT unnest(tours) EXCEPT SELECT unnest(ARRAY[$1])
            )
            WHERE id = $2 RETURNING tours"
    )
        .bind(body.tours.clone())
        .bind(id)
        .fetch_one(&state.db)
        .await
    {
        Ok(client) => HttpResponse::Ok().json(client),
        Err(e) => HttpResponse::BadRequest().json( Response { message: e.to_string() }),
    }
}

#[delete("/deleteclient/{id}")]
async fn delete_client(state: Data<AppState>, id: Path<i32>) -> impl Responder {
    let id: i32 = id.into_inner();

    match sqlx::query_as::<_, Client>(
        "DELETE FROM clients WHERE id = $1 RETURNING id, name, email, password1, password2, tours"
    )
        .bind(id)
        .fetch_one(&state.db)
        .await
    {
        Ok(client) => HttpResponse::Ok().json(client),
        Err(e) => HttpResponse::BadRequest().json( Response { message: e.to_string() }),
        //Err(_) => HttpResponse::InternalServerError().json("Failed to delete client"),
    }
}

#[post("/decode")]
async fn decode_token(body: Json<DecodeToken>, secret: Data<String>) -> HttpResponse {
    let decoded: Result<TokenData<Claims>, JwtError> = decode::<Claims>(
        &body.token,
        &DecodingKey::from_secret(secret.as_str().as_ref()),
        &Validation::new(Algorithm::HS256)
    );

    match decoded {
        Ok(token) => HttpResponse::Ok().json(DecodedResponse {
            message: ("Authorized!").to_owned(),
            id: token.claims.id,
        }),
        Err(e) => HttpResponse::BadRequest().json( Response { message: e.to_string() }),
    }
}

#[get("/protected")]
async fn protected(auth_token: AuthenticationToken) -> HttpResponse {
    println!("{}", auth_token.id);
    HttpResponse::Ok().json(Response { message: "protected".to_owned()})
}




//Agent functions


#[post("/create-agent")]
async fn create_agent(state: Data<AppState>, body: Json<CreateAgent>) -> impl Responder {
    let is_valid = body.validate();

    match is_valid {
        Ok(_) => {
            match sqlx::query_as::<_, CreateAgent>(
                "INSERT INTO agents (name, email, password1, password2, contact, listings) VALUES ($1, $2, $3, $4, $5, $6) RETURNING name, email, password1, password2, contact, listings"
            )
                .bind(body.name.to_string())
                .bind(body.email.to_string())
                .bind(body.password1.to_string())
                .bind(body.password2.to_string())
                .bind(body.contact)
                .bind(body.listings.clone())
                .fetch_one(&state.db)
                .await
            {
                Ok(agent) => HttpResponse::Ok().json(agent),
                Err(e) => HttpResponse::BadRequest().json( Response { message: e.to_string() }),
                //Err(_) => HttpResponse::InternalServerError().json("Failed to create agent"),
            }
        }
        Err(_) => HttpResponse::Ok().body("Agent name is requied!")
    }
    
}

#[post("/agent/login")]
async fn login_agent(state: Data<AppState>, login_data: Json<AgentLogin>, secret: Data<String>) -> impl Responder {
    let agent = sqlx::query_as::<_, Agent>(
        "SELECT * FROM agents WHERE email=$1"
    )
        .bind(&login_data.email)
        .fetch_one(&state.db)
        .await;

    match agent {
        Ok(agent) => {
            if &login_data.password == &agent.password1 {
                let id: i32 = agent.id;
                let exp: usize = (Utc::now() + Duration::minutes(30)).timestamp() as usize;
                let claims: Claims = Claims { id, exp };

                let token: String = encode(
                    &Header::default(),
                    &claims,
                    &EncodingKey::from_secret(secret.as_str().as_ref())
                ).unwrap();

                HttpResponse::Ok().json(AgentEncodedResponse {
                    message: "successfully created token".to_owned(),
                    token,
                    agent
                })
            } else {
                HttpResponse::Unauthorized().finish()
            }
        }
        Err(_) => HttpResponse::Unauthorized().finish(),
    }
}

#[get("/agents")]
async fn view_agents(state: Data<AppState>) -> impl Responder {
    
    match sqlx::query_as::<_, Agent>(
        "SELECT * FROM agents"
    )
        .fetch_all(&state.db)
        .await
    {
        Ok(agents) => HttpResponse::Ok().json(agents),
        Err(e) => HttpResponse::BadRequest().json( Response { message: e.to_string() }),
        //Err(_) => HttpResponse::InternalServerError().json("Failed to get clients"),
    }
}

#[get("/agent/{id}")]
async fn view_agent(state: Data<AppState>, id: Path<i32>, auth_token: AuthenticationToken) -> impl Responder {
    let id: i32 = id.into_inner();
    
    match sqlx::query_as::<_, Agent>(
        "SELECT * FROM agents WHERE id = $1"
    )
        .bind(id)
        .fetch_one(&state.db)
        .await
    {
        Ok(agent) => HttpResponse::Ok().json(agent),
        Err(e) => HttpResponse::BadRequest().json( Response { message: e.to_string() }),
        //Err(_) => HttpResponse::InternalServerError().json("Failed to get agent"),
    }
}

#[patch("/updateagent/{id}")]
async fn update_agent(state: Data<AppState>, body: Json<UpdateAgent>, id: Path<i32>) -> impl Responder {
    let id: i32 = id.into_inner();

    let is_valid = body.validate();

    match is_valid {
        Ok(_) => {
            match sqlx::query_as::<_, UpdateAgent>(
                "UPDATE agents SET name = $1, email= $2, password1 = $3, password2 = $4, contact = $5 WHERE id = $6 RETURNING name, email, password1, password2, contact"
            )
                .bind(body.name.to_string())
                .bind(body.email.to_string())
                .bind(body.password1.to_string())
                .bind(body.password2.to_string())
                .bind(body.contact)
                .bind(id)
                .fetch_one(&state.db)
                .await
            {
                Ok(agent) => HttpResponse::Ok().json(agent),
                Err(e) => HttpResponse::BadRequest().json( Response { message: e.to_string() }),
                //Err(_) => HttpResponse::InternalServerError().json("Failed to update agent"),
            }
        }
        Err(_) => HttpResponse::Ok().body("Agent name is requied!")
    }
}

#[delete("/deleteagent/{id}")]
async fn delete_agent(state: Data<AppState>, id: Path<i32>) -> impl Responder {
    let id: i32 = id.into_inner();

    match sqlx::query_as::<_, Agent>(
        "DELETE FROM agents WHERE id = $1 RETURNING name, email"
    )
        .bind(id)
        .fetch_one(&state.db)
        .await
    {
        Ok(agent) => HttpResponse::Ok().json(agent),
        Err(e) => HttpResponse::BadRequest().json( Response { message: e.to_string() }),
        //Err(_) => HttpResponse::InternalServerError().json("Failed to delete agent"),
    }
}






//Listing functions


#[post("/agent/{id}/create-listing")]
async fn create_listing(state: Data<AppState>, body: Json<CreateListing>, id: Path<i32>) -> impl Responder {
    let is_valid = body.validate();

    let agent_id = id.into_inner();

    match is_valid {
        Ok(_) => {
            match sqlx::query_as::<_, CreateListing>(
                "INSERT INTO listings (
                    name, location, price, bedrooms, visual_urls,
                    ownership, distance, agent, tours
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9
                ) RETURNING name, location, price, bedrooms, ownership, distance, agent, tours"
            )
                .bind(body.name.to_string())
                .bind(body.location.to_string())
                .bind(body.price)
                .bind(body.bedrooms)
                .bind(body.visual_urls.clone())
                .bind(body.ownership.to_string())
                .bind(body.distance)
                .bind(agent_id)
                .bind(body.tours)
                .fetch_one(&state.db)
                .await
            {
                Ok(listing) => HttpResponse::Ok().json(listing),
                Err(e) => HttpResponse::BadRequest().json( Response { message: e.to_string() }),
                //Err(_) => HttpResponse::InternalServerError().json("Failed to create listing"),
            }
        }
        Err(_) => HttpResponse::Ok().body("Listing name is requied!")
    }
    
}


#[get("/listings")]
async fn get_listings(state: Data<AppState>, auth_token: AuthenticationToken) -> impl Responder {
    match sqlx::query_as::<_, Listing>(
        "SELECT * FROM listings"
    )
        .fetch_all(&state.db)
        .await
    {
        Ok(listings) => HttpResponse::Ok().json(listings),
        Err(e) => HttpResponse::BadRequest().json( Response { message: e.to_string() }),
        //Err(_) => HttpResponse::InternalServerError().json("Failed to get listings"),
    }
}

#[get("/listing/{id}")]
async fn listing_detail(state: Data<AppState>, id: Path<i32>, auth_token: AuthenticationToken) -> impl Responder {
    let id: i32 = id.into_inner();
    
    match sqlx::query_as::<_, Listing>(
        "SELECT * FROM listings WHERE id = $1"
    )
        .bind(id)
        .fetch_one(&state.db)
        .await
    {
        Ok(listing) => HttpResponse::Ok().json(listing),
        Err(e) => HttpResponse::BadRequest().json( Response { message: e.to_string() }),
        //Err(_) => HttpResponse::InternalServerError().json("Failed to get listing"),
    }
}

#[get("/listing/{id}/visuals")]
async fn listing_visuals(state: Data<AppState>, id: Path<i32>) -> impl Responder {
    let id: i32 = id.into_inner();
    
    match sqlx::query_as::<_, ListingVisual>(
        "SELECT visual_urls FROM listings WHERE id = $2"
    )
        .bind(id)
        .fetch_one(&state.db)
        .await
    {
        Ok(visual) => HttpResponse::Ok().json(visual),
        Err(e) => HttpResponse::BadRequest().json( Response { message: e.to_string() }),
        //Err(_) => HttpResponse::InternalServerError().json("Failed to get listing"),
    }
}


#[get("/agent/{id}/listings")]
async fn get_agent_listings(state: Data<AppState>, id: Path<i32>) -> impl Responder {
    
    let id: i32 = id.into_inner();

    match sqlx::query_as::<_, Listing>(
        "SELECT * FROM listings WHERE agent = $1"
    )
        .bind(id)
        .fetch_all(&state.db)
        .await
    {
        Ok(listings) => HttpResponse::Ok().json(listings),
        Err(e) => HttpResponse::BadRequest().json( Response { message: e.to_string() }),
        //Err(_) => HttpResponse::InternalServerError().json("Failed to get agent's listings"),
    }
}


#[patch("/updatelisting/{id}")]
async fn update_listing(state: Data<AppState>, body: Json<UpdateListing>, id: Path<i32>) -> impl Responder {
    //let id = id.into_inner().id;
    let id: i32 = id.into_inner();

    let is_valid = body.validate();

    match is_valid {
        Ok(_) => {
            match sqlx::query_as::<_, UpdateListing>(
                "UPDATE listings SET
                    name = $1, location = $2, price = $3, bedrooms = $4,
                    ownership = $5, distance = $6
                WHERE id = $7
                RETURNING name, location, price, bedrooms, ownership, distance"
            )
                .bind(body.name.to_string())
                .bind(body.location.to_string())
                .bind(body.price)
                .bind(body.bedrooms)
                .bind(body.ownership.to_string())
                .bind(body.distance)
                .bind(id)
                .fetch_one(&state.db)
                .await
            {
                Ok(listing) => HttpResponse::Ok().json(listing),
                Err(e) => HttpResponse::BadRequest().json( Response { message: e.to_string() }),
                //Err(_) => HttpResponse::InternalServerError().json("Failed to update listing"),
            }
        }
        Err(_) => HttpResponse::Ok().body("listing name is requied!")
    }
}


//increase listing tours
// UPDATE listings
// SET tours = tours + 1
// WHERE id=4;

//add listing to tours
#[patch("/listingtours-add/{id}")]
async fn add_listing_tours(state: Data<AppState>, _body: Json<ListingTour>, id: Path<i32>) -> impl Responder {
    let id: i32 = id.into_inner();

    match sqlx::query_as::<_, ListingTour>(
        "UPDATE listings SET tours = tours + 1 WHERE id = $1 RETURNING tours"
    )
        .bind(id)
        .fetch_one(&state.db)
        .await
    {
        Ok(listing) => HttpResponse::Ok().json(listing),
        Err(e) => HttpResponse::BadRequest().json( Response { message: e.to_string() }),
    }
}

//remove listing to tours
#[patch("/listingtours-remove/{id}")]
async fn remove_listing_tours(state: Data<AppState>, _body: Json<ListingTour>, id: Path<i32>) -> impl Responder {
    let id: i32 = id.into_inner();

    match sqlx::query_as::<_, ListingTour>(
        "UPDATE listings SET tours = tours - 1 WHERE id = $1 RETURNING tours"
    )
        .bind(id)
        .fetch_one(&state.db)
        .await
    {
        Ok(listing) => HttpResponse::Ok().json(listing),
        Err(e) => HttpResponse::BadRequest().json( Response { message: e.to_string() }),
    }
}


#[delete("/delete_listing/{id}")]
async fn delete_listing(state: Data<AppState>, id: Path<i32>) -> impl Responder {
    let id: i32 = id.into_inner();

    match sqlx::query_as::<_, Listing>(
        "DELETE FROM listings WHERE id = $1"
    )
        .bind(id)
        .fetch_one(&state.db)
        .await
    {
        Ok(listing) => HttpResponse::Ok().json(listing),
        Err(err) => {
            eprint!("Error deleting todo: {:?}", err);
            HttpResponse::InternalServerError().json("Failed to delete todo")
        }
    }
}
