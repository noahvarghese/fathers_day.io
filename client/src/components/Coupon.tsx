import React from "react";
import { CouponAttributes } from "../pages/Coupons";
import "./Coupon.css";

interface CouponProps {
    coupon: CouponAttributes;
}
const Coupon: React.FC<CouponProps> = (props) => {
    return <div className="Coupon"></div>;
};

export default Coupon;
