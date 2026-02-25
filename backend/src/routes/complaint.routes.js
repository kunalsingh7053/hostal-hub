const router = require("express").Router();
const ctrl = require("../controllers/complaint.controller");
const auth = require("../middleware/auth.middleware");
const wardenOnly = require("../middleware/warden.middleware");

router.post("/", auth, ctrl.createComplaint);
router.get("/my", auth, ctrl.getMyComplaints);

router.get("/", auth, wardenOnly, ctrl.getAllComplaints);
router.patch("/:id/status", auth, wardenOnly, ctrl.updateStatus);
router.delete("/:id", auth, wardenOnly, ctrl.deleteComplaint);

module.exports = router;