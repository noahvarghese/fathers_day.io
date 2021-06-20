import React from "react";
import "./Input.css";

interface InputProps {
    type: string;
    name: string;
    placeholder?: string;
    isReadonly?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    datalist?: {
        list: string;
        options: string[];
    };
}

const Input: React.FC<InputProps> = (props) => {
    return (
        <div className="input">
            <input
                placeholder={props.placeholder ?? props.name}
                type={props.type}
                readOnly={props.isReadonly}
                name={props.name}
                onChange={props.onChange}
                value={props.value ?? undefined}
                autoComplete="off"
                list={props.datalist ? props.datalist.list : undefined}
            />

            {props.datalist ? (
                <datalist id={props.datalist.list}>
                    {props.datalist.options.map((opt) => (
                        <option value={opt} />
                    ))}
                </datalist>
            ) : null}
        </div>
    );
};

export default Input;
