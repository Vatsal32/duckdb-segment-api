import router, {Router} from "express";
import SegmentController from "../controller/SegmentController";

const route: Router = router();

route.post('/segment', SegmentController.segment);

export default route;