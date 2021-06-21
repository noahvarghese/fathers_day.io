import React from "react";
import SecondaryButton from "./SecondaryButton";
import "./SelectableButton.css";

interface SelectableButtonProps {
    text: string;
    active: boolean;
    onClick: () => void;
}

const SelectableButton: React.FC<SelectableButtonProps> = (props) => {
    return (
        <SecondaryButton
            className={`SelectableButton SecondaryButton ${
                props.active ? "active" : ""
            }`}
            text={props.text}
            onClick={props.onClick}
        />
    );
};

export default SelectableButton;
