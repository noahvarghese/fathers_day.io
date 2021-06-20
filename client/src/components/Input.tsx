import React from "react";
import "./Input.css";

interface InputProps {
    type: string;
    name: string;
    isReadonly?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
}

const Input: React.FC<InputProps> = (props) => {
    return (
        <div className="input">
            <input
                placeholder={props.name}
                type={props.type}
                readOnly={props.isReadonly}
                name={props.name}
                onChange={props.onChange}
                value={props.value}
                autoComplete="off"
            />
        </div>
    );
};

export default Input;
