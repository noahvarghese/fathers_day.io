import { Router, Request, Response } from "express";
import { Connection, Not } from "typeorm";
import Family from "../../models/family";
import User from "../../models/user";

const router = Router();

const getRequests = async (confirmed: boolean, req: Request) => {
    const { SqlConnection: connection } = req;
    const { user_id } = req.session;

    const familyRequests = await connection.manager.find(Family, {
        where: [
            { giver: user_id, confirmed, initiator: Not(user_id) },
            { receiver: user_id, confirmed, initiator: Not(user_id) },
        ],
    });

    const returnVals: any[] = [];

    for (const fam of familyRequests) {
        const user = await connection.manager.find(User, {
            where: { id: fam.giver === user_id ? fam.receiver : fam.giver },
        });

        if (user.length !== 1) return;

        returnVals.push({
            id: fam.id,
            name: user[0].name,
            relationship:
                fam.giver === user_id
                    ? fam.receiver_relationship
                    : fam.giver_relationship,
        });
    }

    return returnVals;
};

router.get("/", async (req: Request, res: Response) => {
    try {
        const familyRequests = await getRequests(true, req);
        res.status(200).json(familyRequests);
    } catch (e) {
        res.status(500).json({ message: "SQL query failed." });
    }
});

router.get("/pending", async (req: Request, res: Response) => {
    try {
        const familyRequests = await getRequests(false, req);
        res.status(200).json(familyRequests);
    } catch (e) {
        res.status(500).json({ message: "SQL query failed." });
    }
});

export default router;
