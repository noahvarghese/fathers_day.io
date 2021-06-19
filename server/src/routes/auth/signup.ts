import { Request, Response, Router } from "express";
import validator from "validator";
import Family from "../../models/family";
import FamilyNotRegistered from "../../models/family_not_registered";
import { relationship_types } from "../../models/relationship_types";
import User from "../../models/user";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    if (req.session && req.session.user_id && req.session.business_id) {
        const { SqlConnection: connection } = req;

        const { name, email, password, confirmPassword } = req.body;

        if (validator.isEmail(email) === false) {
            res.status(400).json({ message: "Invalid email." });
            return;
        }

        const user: User = new User({ name, email });
        if (password !== confirmPassword) {
            res.status(400).json({
                message: "Password and confirm password do not match",
            });
            return;
        }

        if ((password as string).length < 8) {
            res.status(400).json({
                message: "Password must be greater than 8 characters.",
            });
            return;
        }

        user.hashPassword(password);
        connection.manager.save(user);

        const pending_family_members: FamilyNotRegistered[] =
            await connection.manager.find(FamilyNotRegistered, {
                where: { unregistered_email: email },
            });

        if (pending_family_members.length > 0) {
            for (const pending_member of pending_family_members) {
                if (
                    pending_member.registered_user_relationship_type ===
                        relationship_types.Husband ||
                    pending_member.registered_user_relationship_type ===
                        relationship_types.Wife ||
                    pending_member.registered_user_relationship_type ===
                        relationship_types.Partner
                ) {
                    // create 2 relationship instances for husband/wife wife/husband partner/partner etc
                    const famRequest1: Family = new Family({
                        confirmed: false,
                        receiver: pending_member.registered_user_id,
                        receiver_relationship:
                            pending_member.registered_user_relationship_type,
                        giver: user.id,
                        giver_relationship:
                            pending_member.unregistered_user_relationship_type,
                    });

                    const famRequest2: Family = new Family({
                        confirmed: false,
                        receiver: user.id,
                        receiver_relationship:
                            pending_member.unregistered_user_relationship_type,
                        giver: pending_member.registered_user_id,
                        giver_relationship:
                            pending_member.registered_user_relationship_type,
                    });

                    await connection.manager.save(famRequest1);
                    await connection.manager.save(famRequest2);
                } else {
                    if (
                        pending_member.registered_user_relationship_type ===
                            relationship_types.Parent ||
                        pending_member.registered_user_relationship_type ===
                            relationship_types.GrandParent ||
                        pending_member.registered_user_relationship_type ===
                            relationship_types.GreatGrandParent
                    ) {
                        const famRequest: Family = new Family({
                            confirmed: false,
                            receiver: pending_member.registered_user_id,
                            receiver_relationship:
                                pending_member.registered_user_relationship_type,
                            giver: user.id,
                            giver_relationship:
                                pending_member.unregistered_user_relationship_type,
                        });

                        await connection.manager.save(famRequest);
                    } else {
                        const famRequest: Family = new Family({
                            confirmed: false,
                            giver: pending_member.registered_user_id,
                            giver_relationship:
                                pending_member.registered_user_relationship_type,
                            receiver: user.id,
                            receiver_relationship:
                                pending_member.unregistered_user_relationship_type,
                        });

                        await connection.manager.save(famRequest);
                    }
                }
            }
        }

        res.sendStatus(200);
    }
});

export default router;
