
import {uid } from "rand-token";
import bcrypt from "bcrypt";
import {Entity, Column} from "typeorm";
import BaseModel from "./base_model";

export interface UserAttributes {
    name: string;
    email: string;
    password: string;
    reset_token?: string | undefined;
    reset_token_expiry?: Date | undefined;
}

const EmptyUserAttributes = (): UserAttributes => ({
    name: "",
    email: "",
    password: "",
    reset_token: undefined,
    reset_token_expiry: undefined
});

export const UserBuilder = <T extends Partial<UserAttributes>>(
    options?: T
): UserAttributes & T => Object.assign(EmptyUserAttributes(), options);

@Entity({name : "user"})
export default class User extends BaseModel implements UserAttributes {
    @Column()
    public name!: string;
    @Column()
    public email!: string; 
    @Column()
    public password!: string;
    @Column()
    public reset_token?: string;
    @Column()
    public reset_token_expiry?: Date;

    public constructor(options?: Partial<UserAttributes>) {
        super();
        const userAttr = UserBuilder(options);
        Object.assign(this, userAttr);
    }

    public createToken = (): void => {
        this.reset_token = uid(32);
    };

    public compareToken = (_token: string): boolean => {
        if (
            this.reset_token_expiry &&
            this.reset_token_expiry.getTime() > new Date().getTime()
        ) {
            return this.reset_token === _token;
        }
        return false;
    };

    public comparePassword = async (_password: string): Promise<boolean> => {
        return await new Promise((res, rej) => {
            bcrypt.compare(_password, this.password, (err, same) => {
                if (err) {
                    rej(err);
                }
                res(same);
            });
        });
    };

    public hashAndSavePassword = async (_password: string): Promise<string> => {
        const hash = await new Promise<string>((res, rej) => {
            bcrypt.hash(_password, 12, (err, hash) => {
                if (err) {
                    rej(err);
                }

                res(hash);
            });
        });

        this.password = hash;
        return hash;
    };

    public resetPassword = async (
        password: string,
        token: string
    ): Promise<boolean> => {
        if (this.compareToken(token)) {
            await this.hashAndSavePassword(password);
            this.reset_token = undefined;
            this.reset_token_expiry = undefined;
            return true;
        }

        return false;
    };
}