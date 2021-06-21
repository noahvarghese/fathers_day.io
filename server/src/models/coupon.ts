import { Entity, Column } from "typeorm";
import BaseModel from "./base_model";

export interface CouponAttributes {
    title: string;
    redemption_requested: boolean;
    to_be_completed_by_date?: Date | undefined;
    redeemed: boolean;
    redeem_notes: string;
    completed: boolean;
    completed_on?: Date | undefined;
    relationship: number;
}

const EmptyCouponAttributes = (): CouponAttributes => ({
    title: "",
    redemption_requested: false,
    to_be_completed_by_date: undefined,
    redeemed: false,
    redeem_notes: "",
    completed: false,
    completed_on: undefined,
    relationship: -1,
});

export const CouponBuilder = <T extends Partial<CouponAttributes>>(
    options?: T
): CouponAttributes & T => Object.assign(EmptyCouponAttributes(), options);

@Entity({ name: "coupon" })
export default class Coupon extends BaseModel implements CouponAttributes {
    @Column()
    public title!: string;
    @Column()
    public redemption_requested!: boolean;
    @Column({ type: "datetime" })
    public to_be_completed_by_date?: Date | undefined;
    @Column()
    public redeemed!: boolean;
    @Column()
    public redeem_notes!: string;
    @Column()
    public completed!: boolean;
    @Column({ type: "datetime" })
    public completed_on?: Date | undefined;
    @Column()
    public relationship!: number;

    public constructor(options?: Partial<CouponAttributes>) {
        super();
        const couponAttr = CouponBuilder(options);
        Object.assign(this, couponAttr);
    }
}
