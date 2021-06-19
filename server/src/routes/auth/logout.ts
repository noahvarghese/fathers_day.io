import { Router, Request, Response } from "express";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    if (req.session.user_id) {
        req.session.destroy((err) => {
            if (!err) {
                res.clearCookie("fathers_day_sid");
                res.clearCookie("sid");
                res.sendStatus(200);
            }
        });
    }
});

export default router;
