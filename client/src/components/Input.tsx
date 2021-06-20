import React from "react";
import "./Input.css";

interface InputProps {
    type: string;
    name: string;
    isReadonly?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = (props) => {
    return (
        <div className="input">
            <input
                placeholder={props.name}
                type={props.type}
                readOnly={props.isReadonly}
                name={props.name}
            />
        </div>
    );
};

export default Input;
