import React from "react";
import PrimaryButton, { ButtonProps } from "./PrimaryButton";
import "./SecondaryButton.css";

const SecondaryButton: React.FC<ButtonProps> = (props) => {
    return (
        <PrimaryButton
            className="SecondaryButton"
            text={props.text}
            onClick={props.onClick}
        />
    );
};

export default SecondaryButton;
