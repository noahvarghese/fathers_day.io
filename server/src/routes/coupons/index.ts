import { Router } from "express";
import couponRoute from "./retrieve";
import addRoute from "./add";

const router = Router();

router.use("/", couponRoute);
router.use("/gift", addRoute);

export default router;
