import { createConnection, ConnectionOptions, Connection } from "typeorm";
import User from "../models/user";
import Family from "../models/family";
import FamilyNotRegistered from "../models/family_not_registered";
import Coupon from "../models/coupon";
import DBLogger from "../util/logs/db_logger";


export const connection: ConnectionOptions = {
    database: process.env.DB ?? "",
    host: process.env.DB_URL ?? "",
    username: process.env.DB_USER ?? "",
    password: process.env.DB_PWD ?? "",
    // enforce strict typing by only applying
    // a small subset of the potential database types
    type: (process.env.DB_TYPE as "mysql" | "postgres") ?? "",
    entities: [
        User,
        Family,
        FamilyNotRegistered,
        Coupon
    ],
    logging: true,
    logger: new DBLogger(),
};

export const devConnection: ConnectionOptions = {
    database: process.env.DB ? process.env.DB + "_dev" : "",
    host: process.env.DB_URL ?? "",
    username: process.env.DB_USER ?? "",
    password: process.env.DB_PWD ?? "",
    // enforce strict typing by only applying
    // a small subset of the potential database types
    type: (process.env.DB_TYPE as "mysql" | "postgres") ?? "",
    entities: [
        User,
        Family,
        FamilyNotRegistered,
        Coupon
    ],
    logging: true,
    logger: new DBLogger(),
};

export const testConnection: ConnectionOptions = {
    database: process.env.DB ? process.env.DB + "_test" : "",
    host: process.env.DB_URL ?? "",
    username: process.env.DB_USER ?? "",
    password: process.env.DB_PWD ?? "",
    // enforce strict typing by only applying
    // a small subset of the potential database types
    type: (process.env.DB_TYPE as "mysql" | "postgres") ?? "",
    entities: [
        User,
        Family,
        FamilyNotRegistered,
        Coupon
    ],
    logging: true,
    logger: new DBLogger(),
};

export default async (): Promise<Connection> =>
    await createConnection(connection);
