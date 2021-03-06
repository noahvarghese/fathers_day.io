import { Router, Request, Response } from "express";
import { Connection, Not } from "typeorm";
import Family from "../../models/family";
import FamilyNotRegistered from "../../models/family_not_registered";
import User from "../../models/user";
import Logs from "../../util/logs/logs";

const router = Router();

const getRequests = async (confirmed: boolean, req: Request) => {
    const { SqlConnection: connection } = req;
    const { user_id } = req.session;

    const familyRequests = await connection.manager.find(Family, {
        where: [
            { giver: user_id, confirmed },
            { receiver: user_id, confirmed },
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
            initiator: fam.initiator === user_id,
        });
    }

    if (!confirmed) {
        const famNotRegistered = await connection.manager.find(
            FamilyNotRegistered,
            {
                where: {
                    registered_user_id: user_id,
                },
            }
        );

        for (const fam of famNotRegistered) {
            returnVals.push({
                id: fam.id,
                name: fam.unregistered_email,
                relationship: fam.unregistered_user_relationship_type,
                initiator: true,
            });
        }
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

router.get("/all", async (req: Request, res: Response) => {
    const { SqlConnection: connection } = req;
    const { user_id } = req.session;

    try {
        const family = await connection.manager.find(Family, {
            where: { giver: user_id, confirmed: true },
        });

        // console.log(family);
        const returnVals: { id: number; name: string }[] = [];

        for (const fam of family) {
            const user = await connection.manager.findOne(User, fam.receiver);
            if (user) returnVals.push({ name: user.name, id: user.id });
        }

        res.status(200).json(returnVals);
        return;
    } catch (e) {
        res.status(500).json({ message: "SQL query failed" });
        Logs.Error("SQL query failed");
        return;
    }
});

export default router;
