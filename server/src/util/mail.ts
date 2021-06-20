import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Logs from "./logs/logs";
import User from "../models/user";
import { client } from "./permalink";
import { relationship_types } from "../models/relationship_types";
dotenv.config();

export interface mailOptions {
    from: string;
    to: string;
    subject: string;
    text: string;
    html?: string;
}

export const defaultMailOpts = (): mailOptions => ({
    from: process.env.MAIL_USER ?? "",
    to: "",
    subject: "",
    text: "",
});

export const sendRelationshipRequest = async (
    user: User,
    email: string,
    giver: boolean,
    receiver: boolean,
    relationship: relationship_types
) => {
    const subject = "Family request";
    const html = `<div><div><sub><em>Please do not reply to this email. It will not reach the intended recipient.</em></sub></div><div>User ${
        user.name
    } ${user.email} has invited you to ${
        giver && receiver
            ? "give and receive "
            : giver
            ? "give "
            : receiver
            ? "receiver "
            : ""
    } coupons from them on <a href='${client}'>${client}</a>${relationship.toLowerCase()}</div></div>`;
    const mailOpts = defaultMailOpts();
    mailOpts.subject = subject;
    mailOpts.html = html;
    mailOpts.to = email;

    return await sendMail(mailOpts);
};

export const sendUnregisteredRelationshipRequest = async (
    user: User,
    email: string,
    giver: boolean,
    receiver: boolean,
    relationship: relationship_types
) => {
    const subject = "Family request";
    const html = `<div><div><sub><em>Please do not reply to this email. It will not reach the intended recipient.</em></sub></div><div>User ${
        user.name
    } ${user.email} has invited you to signup and ${
        giver && receiver
            ? "give and receive "
            : giver
            ? "give "
            : receiver
            ? "receiver "
            : ""
    } coupons from them on <a href='${client}'>${client}</a> as their ${relationship.toLowerCase()}</div></div>`;
    const mailOpts = defaultMailOpts();
    mailOpts.subject = subject;
    mailOpts.html = html;
    mailOpts.to = email;

    return await sendMail(mailOpts);
};

export const sendMail = async (opts: mailOptions): Promise<boolean> => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PWD,
        },
    });

    return new Promise((res, rej) => {
        transporter.sendMail(opts, (err, info) => {
            if (err) {
                Logs.Error(err.message);
                rej(false);
            } else {
                Logs.Event(`Message ${info.messageId} sent: ${info.envelope}`);
                res(true);
            }
        });
    });
};
