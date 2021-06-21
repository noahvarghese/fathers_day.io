import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Back from "../components/Back";
import SecondaryButton from "../components/Buttons/SecondaryButton";
import SelectableButton from "../components/Buttons/SelectableButton";
import Coupon from "../components/Coupon";
import Logout from "../components/Logout";
import { server } from "../util/permalink";
import "./Coupons.css";

interface CouponsProps {
    setLoggedIn: () => void;
    userID: number;
}

export interface CouponAttributes {
    giver: number;
    name: string;
    title: string;
    redemption_requested: boolean;
    to_be_completed_by: Date;
    redeemed: boolean;
    completed: boolean;
}

const Coupons: React.FC<CouponsProps> = (props) => {
    const history = useHistory();
    const [receivedActive, setReceivedActive] = useState(true);
    const [sentCoupons, setSentCoupons] = useState<CouponAttributes[]>([]);
    const [receivedCoupons, setReceivedCoupons] = useState<CouponAttributes[]>(
        []
    );

    const toggleActive = () => setReceivedActive(!receivedActive);

    const loadReceivedCoupons = async () => {
        const response = await fetch(server + "coupons/received", {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json();
        return data as CouponAttributes[];
    };

    const loadSentCoupons = async () => {
        const response = await fetch(server + "coupons/sent", {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json();
        return data as CouponAttributes[];
    };

    const loadData = async () => {
        setSentCoupons(await loadSentCoupons());
        setReceivedCoupons(await loadReceivedCoupons());
    };

    useEffect(() => {
        (async () => {
            await loadData();
        })();
    }, []);

    return (
        <div className="Coupons">
            <nav>
                <Back />
                <Link to="/home">home</Link>
                <Logout setLoggedIn={props.setLoggedIn} />
            </nav>
            <h1>Coupons</h1>
            <div className="subNav">
                <ul>
                    <li>
                        <SelectableButton
                            text="received"
                            active={receivedActive}
                            onClick={toggleActive}
                        />
                    </li>
                    <li>
                        <SelectableButton
                            text="sent"
                            active={!receivedActive}
                            onClick={toggleActive}
                        />
                    </li>
                </ul>
            </div>
            {receivedActive ? (
                <div className="received container">
                    {receivedCoupons.map((coupon, index) => (
                        <Coupon
                            coupon={coupon}
                            key={index}
                            userID={props.userID}
                        />
                    ))}
                </div>
            ) : (
                <div className="sent container">
                    {sentCoupons.map((coupon, index) => (
                        <Coupon
                            coupon={coupon}
                            key={index}
                            userID={props.userID}
                        />
                    ))}
                </div>
            )}
            <footer>
                <SecondaryButton
                    text="refresh"
                    onClick={async () => await loadData()}
                />
                <SecondaryButton
                    text="request"
                    onClick={async () => history.push("/coupons/request")}
                />
                <SecondaryButton
                    text="gift"
                    onClick={() => history.push("/coupons/gift")}
                />
            </footer>
        </div>
    );
};

export default Coupons;
