import React from "react";
import { CouponAttributes } from "../pages/Coupons";
import "./Coupon.css";

interface CouponProps {
    coupon: CouponAttributes;
    userID: number;
}
const Coupon: React.FC<CouponProps> = (props) => {
    return (
        <div className="Coupon">
            <div className="ticket-content">
                <p>Will: {props.coupon.title}</p>
                <p>
                    {props.coupon.giver === props.userID ? "To" : "From"}:{" "}
                    {props.coupon.name}
                </p>
                <p>
                    {props.coupon.redemption_requested
                        ? "Redeem requested"
                        : props.coupon.redeemed
                        ? "Should be completed"
                        : props.coupon.completed
                        ? "Item completed"
                        : "Not redeemed"}
                </p>
                {props.coupon.to_be_completed_by ? (
                    <p>
                        To be completed by:{" "}
                        {props.coupon.to_be_completed_by.toDateString()}
                    </p>
                ) : null}
            </div>
        </div>
    );
};

export default Coupon;
