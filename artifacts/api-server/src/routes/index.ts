import { Router, type IRouter } from "express";
import healthRouter from "./health";
import blendRouter from "./blend";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(blendRouter);
router.use(adminRouter);

export default router;
