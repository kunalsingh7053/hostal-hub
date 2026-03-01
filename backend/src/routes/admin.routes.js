const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const adminOnly = require("../middleware/admin.middleware");
const ctrl = require("../controllers/admin.controller");
const complaintCtrl = require("../controllers/complaint.controller");

router.get("/registrations/pending", auth, adminOnly, ctrl.getPendingRegistrations);
router.patch("/registrations/:type/:id", auth, adminOnly, ctrl.reviewRegistration);
router.get("/complaints", auth, adminOnly, complaintCtrl.getAllComplaints);
router.patch("/complaints/:id/status", auth, adminOnly, complaintCtrl.updateStatus);
router.patch("/students/:id/status", auth, adminOnly, ctrl.updateStudentStatus);
router.get("/me", auth, adminOnly, ctrl.getAdminProfile);
router.put("/me", auth, adminOnly, ctrl.updateAdminProfile);

module.exports = router;
