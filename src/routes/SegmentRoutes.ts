import router, {Router} from "express";
import SegmentController from "../controller/SegmentController";

const route: Router = router();

route.post('/users', SegmentController.segmentUser);

route.post('/event', SegmentController.segmentEvent);

export default route;