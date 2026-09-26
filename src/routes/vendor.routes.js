const express = require("express")

const authMiddleware = require("../middleware/auth.middleware.js")

const {

    create,

    getAll,

    getOne,

    update,

    remove

} = require("../controllers/vendor.controller");

const router = express.Router();

router.use(authMiddleware);

router.post("/", create);

router.get("/", getAll);

router.get("/:id", getOne);

router.patch("/:id", update);

router.delete("/:id", remove);

module.exports = router;