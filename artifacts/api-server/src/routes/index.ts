import { Router, type IRouter } from "express";
import healthRouter from "./health";
import blendRouter from "./blend";

const router: IRouter = Router();

router.use(healthRouter);
router.use(blendRouter);

export default router;
