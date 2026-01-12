

import { getMyListings } from "../controllers/myListController";
import { verifyToken } from "../middlewares/authMiddleware";
import router from "./authRoutes";

router.get  ("/", verifyToken, getMyListings); 

export default router;
