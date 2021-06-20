import React from "react";
import "./PrimaryButton.css";

export interface ButtonProps {
    text: string;
    className?: string;
    type?: "button" | "submit" | "reset";
    onClick?: (e?: any) => void;
}

const PrimaryButton: React.FC<ButtonProps> = (props) => {
    return (
        <button
            type={props.type ?? "button"}
            className={props.className ?? "PrimaryButton"}
            onClick={props.onClick}
        >
            {props.text}
        </button>
    );
};

export default PrimaryButton;
