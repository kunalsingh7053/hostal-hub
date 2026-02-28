const router = require("express").Router();
const ctrl = require("../controllers/room.controller");
const auth = require("../middleware/auth.middleware");
const wardenOnly = require("../middleware/warden.middleware");

router.post("/", auth, wardenOnly, ctrl.createRoom);
router.get("/", auth, ctrl.getRooms);
router.patch("/:id", auth, wardenOnly, ctrl.updateRoom);
router.delete("/:id", auth, wardenOnly, ctrl.deleteRoom);

router.post("/allocate", auth, wardenOnly, ctrl.allocateRoom);
router.post("/remove", auth, wardenOnly, ctrl.removeStudentFromRoom);

module.exports = router;