import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Input from "../components/Input";
import PrimaryButton from "../components/Buttons/PrimaryButton";
import SecondaryButton from "../components/Buttons/SecondaryButton";
import Error from "../components/Error";
import SuperDad from "../assets/img/super_dad.png";
import { server } from "../util/permalink";
import { sendJSON } from "../util/request";
import "./Login.css";

interface LoginInputs {
    email: string;
    password: string;
}

interface RegisterInputs {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const emptyRegInputs = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
};

const emptyLoginInputs = {
    email: "",
    password: "",
};

const LoginPage: React.FC = () => {
    const history = useHistory();

    const [registerVisible, setRegisterVisible] = useState(false);

    const [error, setError] = useState("");

    const [registerInfo, setRegInfo] = useState<RegisterInputs>(emptyRegInputs);

    const [loginInfo, setLoginInfo] = useState<LoginInputs>(emptyLoginInputs);

    const setVisible = () => {
        setRegInfo(emptyRegInputs);
        setLoginInfo(emptyLoginInputs);
        setRegisterVisible(!registerVisible);
        setError("");
    };

    function checkData<T>(info: any): boolean {
        for (const key of Object.keys(info)) {
            console.log(key, info[key]);
            if (!info[key as keyof T]) {
                setError(`${key} cannot be empty`);
                return false;
            }
        }

        return true;
    }

    const login = async () => {
        if (!checkData<LoginInputs>(loginInfo)) return;

        try {
            const response = await sendJSON(`${server}auth/login`, loginInfo);

            if (response.status !== 202) {
                setError((await response.json()).message);
                return;
            }
        } catch (e) {
            setError("Failed to contact server.");
            return;
        }

        history.push("/home");
    };

    const register = async () => {
        if (!checkData<RegisterInputs>(registerInfo)) return;

        try {
            const response = await sendJSON(
                `${server}auth/signup`,
                registerInfo
            );

            if (response.status !== 200) {
                setError((await response.json()).message);
                return;
            }
        } catch (e) {
            setError("Failed to contact server.");
            return;
        }

        history.push("/home");
    };

    return (
        <div id="LoginPage">
            <div className="imgContainer">
                <img src={SuperDad} alt="Super Dad" />
            </div>
            {error ? <Error message={error} /> : null}
            {registerVisible ? (
                <form id="Register">
                    <Input
                        type="text"
                        name="name"
                        onChange={(e) =>
                            setRegInfo({
                                ...registerInfo,
                                name: e.target.value,
                            })
                        }
                        value={registerInfo.name}
                    />
                    <Input
                        type="email"
                        name="email"
                        onChange={(e) =>
                            setRegInfo({
                                ...registerInfo,
                                email: e.target.value,
                            })
                        }
                        value={registerInfo.email}
                    />
                    <Input
                        type="password"
                        name="password"
                        onChange={(e) =>
                            setRegInfo({
                                ...registerInfo,
                                password: e.target.value,
                            })
                        }
                        value={registerInfo.password}
                    />
                    <Input
                        type="password"
                        name="confirm password"
                        onChange={(e) => {
                            setRegInfo({
                                ...registerInfo,
                                confirmPassword: e.target.value,
                            });
                        }}
                        value={registerInfo.confirmPassword}
                    />
                    <PrimaryButton text="register" onClick={register} />
                    <SecondaryButton onClick={setVisible} text="login" />
                </form>
            ) : (
                <form id="Login">
                    <Input
                        type="email"
                        name="email"
                        onChange={(e) => {
                            setLoginInfo({
                                ...loginInfo,
                                email: e.target.value,
                            });
                        }}
                        value={loginInfo.email}
                    />
                    <Input
                        type="password"
                        name="password"
                        onChange={(e) => {
                            setLoginInfo({
                                ...loginInfo,
                                password: e.target.value,
                            });
                        }}
                        value={loginInfo.password}
                    />
                    <PrimaryButton text="login" onClick={login} />
                    <SecondaryButton onClick={setVisible} text="register" />
                </form>
            )}
        </div>
    );
};

export default LoginPage;
