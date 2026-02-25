const router = require("express").Router();
const ctrl = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");
const wardenOnly = require("../middleware/warden.middleware");

router.get("/me", auth, ctrl.getProfile);
router.put("/me", auth, ctrl.updateProfile);

router.get("/", auth, wardenOnly, ctrl.getAllStudents);
router.delete("/:id", auth, wardenOnly, ctrl.deleteStudent);

module.exports = router;