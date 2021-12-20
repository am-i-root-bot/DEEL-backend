const router = require("express").Router();

router.use("/contracts", require("./contract"));

router.use("/jobs", require("./job"));

router.use("/admin", require("./admin"));

router.use("/balances", require("./balance"));

module.exports = router;
