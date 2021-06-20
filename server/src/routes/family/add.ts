import { Router, Request, Response } from "express";
import Family from "../../models/family";
import FamilyNotRegistered from "../../models/family_not_registered";
import { relationship_types } from "../../models/relationship_types";
import User from "../../models/user";
import Logs from "../../util/logs/logs";
import {
    sendRelationshipRequest,
    sendUnregisteredRelationshipRequest,
} from "../../util/mail";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    const { SqlConnection: connection } = req;
    const { user_id } = req.session;
    const { relationship, email } = req.body;

    const user = await connection.manager.find(User, { where: { email } });

    if (user.length > 1) {
        res.status(500).send({ message: "To many users returned." });
        return;
    }

    // current user type
    let opposite_rel_type: relationship_types = relationship_types.Child;
    // current user role
    let giver: boolean = false;
    let receiver = true;

    switch (relationship) {
        case relationship_types.Partner:
            opposite_rel_type = relationship_types.Partner;
            giver = true;
            receiver = true;
            break;
        case relationship_types.Husband:
            opposite_rel_type = relationship_types.Wife;
            giver = true;
            receiver = true;
            break;
        case relationship_types.Wife:
            opposite_rel_type = relationship_types.Husband;
            giver = true;
            receiver = true;
            break;
        case relationship_types.GreatGrandParent:
            opposite_rel_type = relationship_types.GreatGrandChild;
            giver = true;
            receiver = false;
            break;
        case relationship_types.GrandParent:
            opposite_rel_type = relationship_types.GrandChild;
            giver = true;
            receiver = false;
            break;
        case relationship_types.Parent:
            opposite_rel_type = relationship_types.Child;
            giver = true;
            receiver = false;
            break;
        case relationship_types.GreatGrandChild:
            opposite_rel_type = relationship_types.GreatGrandParent;
            giver = false;
            receiver = true;
            break;
        case relationship_types.GrandChild:
            opposite_rel_type = relationship_types.GrandParent;
            giver = false;
            receiver = true;
            break;
        case relationship_types.Child:
            opposite_rel_type = relationship_types.Parent;
            giver = false;
            receiver = true;
            break;
    }

    if (user.length > 0) {
        if (giver && receiver) {
            // create 2 relationship instances for husband/wife wife/husband partner/partner etc
            const famRequest1: Family = new Family({
                initiator: user_id,
                confirmed: false,
                receiver: user[0].id,
                receiver_relationship: relationship,
                giver: user_id,
                giver_relationship:
                    relationship === relationship_types.Husband
                        ? relationship_types.Wife
                        : relationship === relationship_types.Wife
                        ? relationship_types.Husband
                        : relationship_types.Partner,
            });

            const famRequest2: Family = new Family({
                initiator: user_id,
                confirmed: false,
                receiver: user_id,
                receiver_relationship:
                    relationship === relationship_types.Husband
                        ? relationship_types.Wife
                        : relationship === relationship_types.Wife
                        ? relationship_types.Husband
                        : relationship_types.Partner,
                giver: user[0].id,
                giver_relationship: relationship,
            });

            await connection.manager.save(famRequest1);
            await connection.manager.save(famRequest2);
        } else if (giver && !receiver) {
            const famRequest: Family = new Family({
                initiator: user_id,
                confirmed: false,
                receiver: user[0].id,
                receiver_relationship: relationship,
                giver: user_id,
                giver_relationship:
                    relationship === relationship_types.GreatGrandParent
                        ? relationship_types.GreatGrandChild
                        : relationship === relationship_types.GrandParent
                        ? relationship_types.GrandChild
                        : relationship_types.Child,
            });

            await connection.manager.save(famRequest);
        } else {
            const famRequest: Family = new Family({
                initiator: user_id,
                confirmed: false,
                receiver: user_id,
                receiver_relationship:
                    relationship === relationship_types.GreatGrandChild
                        ? relationship_types.GreatGrandParent
                        : relationship === relationship_types.GrandChild
                        ? relationship_types.GrandParent
                        : relationship_types.Parent,
                giver: user[0].id,
                giver_relationship: relationship,
            });

            await connection.manager.save(famRequest);
        }
        await sendRelationshipRequest(
            (
                await connection.manager.find(User, { where: { id: user_id } })
            )[0],
            email,
            giver,
            receiver,
            relationship
        );
    } else {
        const famRequest: FamilyNotRegistered = new FamilyNotRegistered({
            registered_user_id: user_id,
            registered_user_relationship_type: opposite_rel_type,
            unregistered_email: email,
            unregistered_user_relationship_type: relationship,
        });
        await connection.manager.save(famRequest);

        // Send EMAIL
        await sendUnregisteredRelationshipRequest(
            (
                await connection.manager.find(User, { where: { id: user_id } })
            )[0],
            email,
            giver,
            receiver,
            relationship
        );
    }

    res.sendStatus(200);
});

router.post("/confirm", async (req: Request, res: Response) => {
    const { SqlConnection: connection } = req;
    const { id, confirmed } = req.body;

    let famRequests: Family[] = await connection.manager.find(Family, {
        where: { id },
    });

    if (famRequests.length > 1) {
        res.status(500).json({ message: "To many requests." });
        return;
    }

    try {
        if (confirmed) {
            famRequests[0].confirmed = true;
            await connection.manager.save(famRequests[0]);
        } else {
            await connection.manager.delete(Family, id);
        }
    } catch (e) {
        Logs.Error("Update failed");
        res.status(500).json({ message: "SQL query faile" });
    }

    res.sendStatus(200);
    return;
});

export default router;
