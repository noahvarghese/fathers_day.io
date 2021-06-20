import React from "react";
import { server } from "../util/permalink";
import SecodaryButton from "./Buttons/SecondaryButton";

const Logout: React.FC<{
    setLoggedIn: () => void;
}> = (props) => {
    const logout = async () => {
        console.log("hello");
        await fetch(server + "auth/logout", {
            method: "POST",
            credentials: "include",
        });

        props.setLoggedIn();
    };
    return <SecodaryButton text="logout" onClick={logout} />;
};

export default Logout;
