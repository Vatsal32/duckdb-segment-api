import {Request, Response} from "express";
import db from "../db";
import {DuckDbError, RowData} from "duckdb";

const yyyy_mm_dd_Reg = new RegExp('^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$');

const parseUser: (data: UserSegment) => string = (data: UserSegment) => {
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
        return `"user_id" in ( ${data.user_id.map((it) => it.toString())} )`;
    }

    if (data.and) {
        const a: Array<keyof UserSegment> = Object.keys(data.and) as Array<keyof UserSegment>;
        const len = a.length - 1;

        if (len <= 0) {
            throw new Error("AND has to have at least 2 children");
        }

        return `${a.map((item) => {
            if (data.and === undefined) {
                return '';
            } else {
                return `( ${parseUser({[item]: data.and[item]})} ) `
            }
        }).join(' AND ')}`;
    }

    if (data.or) {
        const a: Array<keyof UserSegment> = Object.keys(data.or) as Array<keyof UserSegment>;
        const len = a.length - 1;

        if (len <= 0) {
            throw new Error("OR has to have at least 2 children");
        }

        return `${a.map((item) => {
            if (data.or === undefined) {
                return '';
            } else {
                return `( ${parseUser({[item]: data.or[item]})} ) `
            }
        }).join(' OR ')}`;
    }

    throw new Error(`No such field present as: ${Object.keys(data)}`);
};

const parseEvent: (data: EventSegment) => string = (data: EventSegment) => {
    if (data.and) {
        const a: Array<keyof EventSegment> = Object.keys(data.and) as Array<keyof EventSegment>;
        const len = a.length - 1;

        if (len <= 0) {
            throw new Error("AND has to have at least 2 children");
        }

        return `${a.map((item) => {
            if (data.and === undefined) {
                return '';
            } else {
                return `( ${parseEvent({[item]: data.and[item]})} ) `
            }
        }).join(' AND ')}`;
    }

    if (data.event_name) {
        if (data.event_name.length === 0) {
            throw Error("Enter at least one event_name");
        } else {
            return `"event_name" IN ( ${data.event_name.map((item) => {
                return `'${item}' `;
            }).join(', ')} )`;
        }
    }

    if (data.or) {
        const a: Array<keyof EventSegment> = Object.keys(data.or) as Array<keyof EventSegment>;
        const len = a.length - 1;

        if (len <= 0) {
            throw new Error("OR has to have at least 2 children");
        }

        return `${a.map((item) => {
            if (data.or === undefined) {
                return '';
            } else {
                return `( ${parseEvent({[item]: data.or[item]})} ) `
            }
        }).join(' OR ')}`;
    }

    if (data.user_id) {
        return `"user_id" in ( ${data.user_id.map((it) => it.toString())} )`;
    }

    if (data.timestamp) {
        if (data.timestamp.to && data.timestamp.from) {
            const validTo = new Date(data.timestamp.to);
            const validFrom = new Date(data.timestamp.from);

            if (!(validFrom.getTime() > 0) || !(validTo.getTime() > 0)) {
                throw new Error("Incorrect Date format");
            }

            return `"timestamp" BETWEEN ${validFrom.getTime()} AND ${validTo.getTime()}`
        } else {
            throw Error("Need both to and from fields");
        }
    }

    throw new Error(`No such field present as: ${Object.keys(data)}`);
};

const handleError = (e: unknown, res: Response) => {
    if (typeof e === "string") {
        console.log("[server]: ", e);
        res.json({message: "Incorrect formatting", data: e});
    } else if (e instanceof Error) {
        console.log("[server]: ", e.message);
        res.json({message: "Incorrect formatting", data: e.message});
    } else {
        res.json({message: "Something went wrong. "});
    }
}

export default {
    segmentUser: async (req: Request, res: Response) => {
        const actualBody = req.body as UserSegment;

        try {
            db.all(`
                SELECT *
                FROM "user"
                WHERE ${parseUser(actualBody)}
            `, (err: DuckDbError | null, data: Array<RowData>): void => {
                if (err) {
                    console.log("[server]: ", err);
                    res.json({message: "Error occurred", data: err});
                } else {
                    res.json({message: "Successful", data})
                }
            });
        } catch (e) {
            handleError(e, res);
        }
    },

    segmentEvent: async (req: Request, res: Response) => {
        const actualBody = req.body as EventSegment;

        try {
            db.all(`
                SELECT *
                FROM "event"
                WHERE ${parseEvent(actualBody)}
            `, (err: DuckDbError | null, data: Array<RowData>): void => {
                if (err) {
                    console.log("[server]: ", err);
                    res.json({message: "Error occurred", data: err});
                } else {
                    res.json({message: "Successful", data})
                }
            });
        } catch (e) {
            handleError(e, res);
        }
    }
};

/*
// "signup_date": {
            //     "to": "2022-09-28",
            //     "from": "2021-09-28"
            // },
            // "signup_date": {
            //     "to": "2021-09-28",
            //     "from": "2020-09-28"
            // },
 */