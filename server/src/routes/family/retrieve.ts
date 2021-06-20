import { Router, Request, Response } from "express";
import Family from "../../models/family";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const { SqlConnection: connection } = req;
    const { user_id } = req.session;

    const familyRequests = await connection.manager.find(Family, {
        where: [
            { giver: user_id, confirmed: true },
            { receiver: user_id, confirmed: true },
        ],
    });

    res.status(200).json(familyRequests);
});

router.get("/pending", async (req: Request, res: Response) => {
    const { SqlConnection: connection } = req;
    const { user_id } = req.session;

    const familyRequests = await connection.manager.find(Family, {
        where: [
            { giver: user_id, confirmed: false },
            { receiver: user_id, confirmed: false },
        ],
    });

    res.status(200).json(familyRequests);
});

export default router;
