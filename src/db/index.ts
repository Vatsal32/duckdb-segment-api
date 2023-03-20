import {Callback, Database, TableData} from "duckdb";

const db = new Database(":memory");

const tp: Callback<void> = (err) => {
    if (err)
        console.log("[database]:", err);
    else
        console.log("[database]: Table created or exists.")
}

const insertCallback1: Callback<TableData> = (err, data) => {
    if (err) {
        console.log("[database]: ", err);
    } else {
        if (data[0].CNT_ROWS == 0) {
            db.run(`
            COPY "user" FROM '/home/vatsal/Vatsal/GitHub/duckdb-segment-api/src/db/USER_MOCK_DATA.csv' (AUTO_DETECT TRUE)
        `, tp);
        }
    }
}

const insertCallback2: Callback<TableData> = (err, data) => {
    if (err) {
        console.log("[database]: ", err);
    } else {
        if (data[0].CNT_ROWS == 0) {
            db.run(`
                COPY "event" FROM '/home/vatsal/Vatsal/GitHub/duckdb-segment-api/src/db/EVENT_MOCK_DATA.csv' (AUTO_DETECT TRUE)
            `, tp);
        }
    }
}

db.run(`
    CREATE TABLE IF NOT EXISTS "user" (
        user_id int not null primary key,
        name varchar(255) not null ,
        age smallint not null check ( age between 15 and 100 ),
        gender varchar(6) not null check ( gender in ('Male', 'Female') ),
        signup_date date not null ,
        subscription_plan varchar(7) not null check(subscription_plan in ('basic', 'pro', 'premium')) ,
        device_type varchar(7) not null check ( device_type in ('mobile', 'desktop', 'watch', 'tv') ),
        location varchar(255) not null
    );
`, tp);

db.all(`
    SELECT count(*) as CNT_ROWS FROM (select 0 from "user" limit 1)
`, insertCallback1);

db.run(`
    CREATE TABLE IF NOT EXISTS "event" (
        user_id int not null primary key,
        event_name varchar(255) not null,
        timestamp bigint not null
    );
`, tp);

db.all(`
    SELECT count(*) as CNT_ROWS FROM (select 0 from "event" limit 1);
`, insertCallback2);

export default db;