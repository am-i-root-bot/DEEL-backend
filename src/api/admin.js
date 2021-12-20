const router = require("express").Router();
const { getTopPaidProfession, getTopClient } = require("../service/admin");

router.get("/best-profession", async (req, res, next) => {
  const { start, end } = req.query;

  try {
    const topProfession = await getTopPaidProfession(start, end);
    return res.json(topProfession);
  } catch (err) {
    next(err);
  }
});

router.get("/best-clients", async (req, res, next) => {
  const { start, end, limit } = req.query;

  try {
    const topClients = await getTopClient(start, end, limit);
    return res.json(topClients);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
