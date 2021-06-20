import React from "react";
import { Link } from "react-router-dom";
import "./Card.css";

interface CardProps {
    img: any;
    title: string;
    onClick?: (e?: any) => void;
    path: string;
}

const Card: React.FC<CardProps> = (props) => {
    return (
        <Link to={props.path}>
            <div className="Card">
                <div className="imgContainer">
                    <img src={props.img} alt={props.title} />
                </div>
                <h2>{props.title}</h2>
            </div>
        </Link>
    );
};

export default Card;
