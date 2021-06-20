import { Router } from "express";
import familyRoute from "./retrieve";
import addRoute from "./add";

const router = Router();

router.use("/", familyRoute);
router.use("/add", addRoute);

export default router;
