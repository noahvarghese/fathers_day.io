import React, { useState } from "react";
import Input from "../components/Input";
import PrimaryButton from "../components/Buttons/PrimaryButton";
import SecondaryButton from "../components/Buttons/SecondaryButton";
import SuperDad from "../assets/img/super_dad.png";
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

const LoginPage: React.FC = () => {
    const [registerVisible, setRegisterVisible] = useState(false);

    const [registerInfo, setRegInfo] = useState<RegisterInputs>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loginInfo, setLoginInfo] = useState<LoginInputs>({
        email: "",
        password: "",
    });

    const setVisible = () => setRegisterVisible(!registerVisible);

    const register = () => {};

    return (
        <div id="LoginPage">
            <div className="imgContainer">
                <img src={SuperDad} alt="Super Dad" />
            </div>
            {registerVisible ? (
                <div id="Register">
                    <Input
                        type="text"
                        name="name"
                        onChange={(e) =>
                            setRegInfo({
                                ...registerInfo,
                                name: e.target.value,
                            })
                        }
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
                    />
                    <PrimaryButton text="register" />
                    <SecondaryButton onClick={setVisible} text="login" />
                </div>
            ) : (
                <div id="Login">
                    <Input
                        type="email"
                        name="email"
                        onChange={(e) => {
                            setLoginInfo({
                                ...loginInfo,
                                email: e.target.value,
                            });
                        }}
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
                    />
                    <PrimaryButton text="login" />
                    <SecondaryButton onClick={setVisible} text="register" />
                </div>
            )}
        </div>
    );
};

export default LoginPage;
