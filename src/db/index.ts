import {Callback, Database, Statement} from "duckdb";

const db = new Database(":memory");

const tp: Callback<void> = (err) => {
    console.log("[server]:", err);
}

// db.run(`
//     CREATE TABLE "user" (
//         user_id int not null primary key,
//         name varchar(255) not null ,
//         age smallint not null check ( age between 15 and 100 ),
//         gender varchar(6) not null check ( gender in ('Male', 'Female') ),
//         signup_date date not null ,
//         subscription_plan varchar(7) not null check(subscription_plan in ('basic', 'pro', 'premium')) ,
//         device_type varchar(7) not null check ( device_type in ('mobile', 'desktop', 'watch', 'tv') ),
//         location varchar(255) not null
//     );
// `, tp);
//
// db.run(`
//     COPY "user" FROM '/home/vatsal/Vatsal/GitHub/octernship/src/db/USER_MOCK_DATA.csv' (AUTO_DETECT TRUE)
// `, tp);

export default db;