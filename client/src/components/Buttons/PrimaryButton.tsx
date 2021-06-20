import React from "react";
import "./PrimaryButton.css";

export interface ButtonProps {
    text: string;
    className?: string;
    onClick?: (e?: any) => void;
}

const PrimaryButton: React.FC<ButtonProps> = (props) => {
    return (
        <button
            className={props.className ?? "PrimaryButton"}
            onClick={props.onClick}
        >
            {props.text}
        </button>
    );
};

export default PrimaryButton;
