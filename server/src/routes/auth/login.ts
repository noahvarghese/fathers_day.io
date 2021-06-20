import { Request, Response, Router } from "express";
import User from "../../models/user";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    const { SqlConnection: connection } = req;

    const { email, password } = req.body;

    const users = await connection.manager.find(User, {
        where: { email },
    });

    if (users.length !== 1) {
        res.status(500).json({ message: "Invalid username/password" });
        return;
    }

    const user = users[0];

    if (user.password) {
        const success = await user.comparePassword(password);
        if (success) {
            req.session.user_id = user.id;
            res.sendStatus(202);
            return;
        }
    }

    res.status(401).json({ message: "Invalid username/password" });
    return;
});

export default router;
