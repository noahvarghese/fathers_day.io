import React from "react";
import { useHistory } from "react-router-dom";
import SecodaryButton from "./Buttons/SecondaryButton";

const Back: React.FC = () => {
    const history = useHistory();

    const back = () => {
        history.goBack();
    };

    return <SecodaryButton text="back" onClick={back} />;
};

export default Back;
