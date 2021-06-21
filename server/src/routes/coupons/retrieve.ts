import { Router, Request, Response } from "express";
import Coupon from "../../models/coupon";
import Family from "../../models/family";
import User from "../../models/user";

const router = Router();

const getCoupons = async (req: Request, giver: boolean) => {
    const { SqlConnection: connection } = req;
    const { user_id } = req.session;

    let family: Family[];

    if (giver) {
        family = await connection.manager.find(Family, {
            where: { giver: user_id },
        });
    } else {
        family = await connection.manager.find(Family, {
            where: { receiver: user_id },
        });
    }

    const returnVals: any[] = [];

    for (const fam of family) {
        const coupons = await connection.manager.find(Coupon, {
            where: { relationship: fam.id },
        });

        const user = await connection.manager.findOne(
            User,
            giver ? fam.receiver : fam.giver
        );

        for (const coupon of coupons) {
            returnVals.push({
                giver: fam.giver,
                name: user?.name,
                title: coupon.title,
                redemption_requested: coupon.redemption_requested,
                to_be_completed_by: coupon.to_be_completed_by_date,
                redeemed: coupon.redeemed,
                completed: coupon.completed,
            });
        }
    }

    return returnVals;
};

router.get("/received", async (req: Request, res: Response) => {
    res.status(200).json(await getCoupons(req, false));
});

router.get("/sent", async (req: Request, res: Response) => {
    res.status(200).json(await getCoupons(req, true));
});

export default router;
