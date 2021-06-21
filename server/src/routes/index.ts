import { Request, Response, Router } from "express";
import { client } from "../util/permalink";
import authRouter from "./auth";
import familyRouter from "./family";
import couponsRouter from "./coupons";

const router = Router();

/* Uncomment after creating the other routes */
router.use("/auth", authRouter);
router.use("/family", familyRouter);
router.use("/coupons", couponsRouter);

// Default route handler to serve the website if requests are made
router.use("/*", (req: Request, res: Response) => {
    res.redirect(client + (req.originalUrl !== "/" ? req.originalUrl : ""));
});

export default router;
