import React from "react";
import "./Error.css";

interface ErrorProps {
    message: string;
}

const Error: React.FC<ErrorProps> = (props) => {
    return (
        <div className="Error">
            <p>{props.message}</p>
        </div>
    );
};

export default Error;
