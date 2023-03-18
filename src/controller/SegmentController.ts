import {Request, Response} from "express";
import db from "../db";
import {Callback, TableData} from "duckdb";

const dataListener: Callback<TableData> = (err, res) => {
    if (err) {
        console.log('[server]', err);
    } else
        console.log("[server]: ", res);
};

const yyyy_mm_dd_Reg = new RegExp('^\\d{4}\\-(0[1-9]|1[012])\\-(0[1-9]|[12][0-9]|3[01])$');
const parse: any = (data: d) => {
    if (data.age) {
        if (data.age.to && data.age.from) {
            return `"age" BETWEEN ${data.age.from} AND ${data.age.to}`
        } else {
            throw Error("Incorrect formatting");
        }
    }

    if (data.device_type) {
        if (data.device_type.length === 0) {
            throw Error("Enter at least one device type");
        } else {
            return `"device_type" IN ( ${data.device_type.map((item) => {
                return `'${item}'`;
            }).join(', ')} )`;
        }
    }

    if (data.gender) {
        return `"gender" = '${data.gender}'`;
    }

    if (data.location) {
        if (data.location.length === 0) {
            throw Error("Enter at least one location");
        } else {
            return `"location" IN ( ${data.location.map((item) => {
                return `'${item}' `;
            }).join(', ')} )`;
        }
    }

    // TODO: add for signup_date timestamp
    if (data.signup_date) {
        if (data.signup_date.to && data.signup_date.from) {
            if (!yyyy_mm_dd_Reg.test(data.signup_date.to) || !yyyy_mm_dd_Reg.test(data.signup_date.from)) {
                throw new Error("Incorrect Date format");
            }

            return `"signup_date" BETWEEN '${data.signup_date.from}' AND '${data.signup_date.to}'`
        } else {
            throw Error("Need both to and from fields");
        }
    }

    if (data.subscription_plan !== undefined) {
        if (data.subscription_plan.length === 0) {
            throw Error("Enter at least one subscription plan");
        } else {
            return `"subscription_plan" IN ( ${data.subscription_plan.map((item) => {
                return `'${item}' `;
            }).join(', ')} )`;
        }
    }

    if (data.user_id) {
        return `"user_id" is ${data.user_id}`;
    }

    if (data.and) {
        const a: Array<keyof d> = Object.keys(data.and) as Array<keyof d>;
        const len = a.length - 1;

        if (len <= 0) {
            throw new Error("AND has to have at least 2 children");
        }

        return `${a.map((item) => {
            if (data.and === undefined) {
                return '';
            } else {
                return `( ${parse({[item]: data.and[item]})} ) `
            }
        }).join(' AND ')}`;
    }

    if (data.or) {
        const a: Array<keyof d> = Object.keys(data.or) as Array<keyof d>;
        const len = a.length - 1;

        if (len <= 0) {
            throw new Error("OR has to have at least 2 children");
        }

        return `${a.map((item) => {
            if (data.or === undefined) {
                return '';
            } else {
                return `( ${parse({[item]: data.or[item]})} ) `
            }
        }).join(' OR ')}`;
    }
};

const segEvents = (data: any) => {
    return "";
};


export default {
    segmentUser: async (req: Request, res: Response) => {
        const actualBody = req.body as d;
        db.all(`
            SELECT *
            FROM "user"
            WHERE ${parse(actualBody)}
        `, dataListener);
        res.json({message: "success"});
    },
    
    segmentEvent: async (req: Request, res: Response) => {
        const actualBody = req.body;


        res.json({message: "success"});
    }
};