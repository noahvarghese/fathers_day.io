import React from "react";
import "./Card.css";

interface CardProps {
    img: any;
    title: string;
    onClick?: (e?: any) => void;
}

const Card: React.FC<CardProps> = (props) => {
    return (
        <div className="Card">
            <div className="imgContainer">
                <img src={props.img} alt={props.title} />
            </div>
            <h2>{props.title}</h2>
        </div>
    );
};

export default Card;
