import { Router, Request, Response } from "express";
import Coupon from "../../models/coupon";
import Family from "../../models/family";
import User from "../../models/user";
import { sendNewCoupon } from "../../util/mail";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    const { SqlConnection: connection } = req;
    const { user_id } = req.session;
    const {
        to: { id },
        coupon: title,
        quantity,
    } = req.body;

    const family = await connection.manager.find(Family, {
        where: { giver: user_id, receiver: id },
    });

    try {
        for (let i = 0; i < quantity; i++) {
            const coupon = new Coupon({
                relationship: family[0].id,
                title,
            });
            await connection.manager.save(coupon);
        }

        const giver = await connection.manager.findOne(User, user_id);
        const receiver = await connection.manager.findOne(User, id);

        await sendNewCoupon(
            giver ?? new User(),
            receiver ?? new User(),
            new Coupon({ title }),
            quantity
        );
        res.sendStatus(200);
        return;
    } catch (e) {
        res.status(500).json({ message: "SQL query failed" });
    }
});

export default router;
