import React from "react";
import "./Success.css";

interface SuccessProps {
    message: string;
}
const Success: React.FC<SuccessProps> = (props) => {
    return (
        <div className="Success">
            <p>{props.message}</p>
        </div>
    );
};

export default Success;
