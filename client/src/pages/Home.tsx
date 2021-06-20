import React from "react";
import "./Home.css";
import Card from "../components/Card";
import Logout from "../components/Logout";
import Family from "../assets/img/family.png";
import Coupons from "../assets/img/coupon.png";

const Home: React.FC<{
    setLoggedIn: () => void;
}> = (props) => {
    return (
        <div className="Home">
            <nav>
                <Logout setLoggedIn={props.setLoggedIn} />
            </nav>
            <h1>Home</h1>
            <Card img={Family} title="Family" path="/family" />
            <Card img={Coupons} title="Coupons" path="/coupons" />
        </div>
    );
};

export default Home;
