import { Router, type IRouter } from "express";
import healthRouter from "./health";
import blendRouter from "./blend";
import roomsRouter from "./rooms";
import bondsRouter from "./bonds";
import journeyRouter from "./journey";

const router: IRouter = Router();

router.use(healthRouter);
router.use(blendRouter);
router.use(roomsRouter);
router.use(bondsRouter);
router.use(journeyRouter);

export default router;
