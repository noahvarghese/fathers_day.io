import dotenv from "dotenv";
import Logs from "./logs/logs";
dotenv.config();

const { TARGET_ENV } = process.env;

let clientURL: string = process.env[`ENV_${TARGET_ENV}_CLIENT`] ?? "";
let serverURL: string = process.env[`ENV_${TARGET_ENV}_SERVER`] ?? "";

if (clientURL !== "") {
    clientURL = `http${TARGET_ENV !== "LOCAL" ? "s" : ""}://${clientURL}/`;
} else {
    Logs.Error(`No client origin found for environment ${TARGET_ENV}`);
}

if (serverURL !== "") {
    serverURL = `http${TARGET_ENV !== "LOCAL" ? "s" : ""}://${serverURL}/`;
} else {
    Logs.Error(`No server origin found for environment ${TARGET_ENV}`);
}

export const client = clientURL;
export const server = serverURL;
