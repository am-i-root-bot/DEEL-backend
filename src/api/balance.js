const router = require("express").Router();
const { getProfile } = require("../middleware/getProfile");
const { deposit } = require("../service/balance");

router.post("/deposit/:userId", getProfile, async (req, res, next) => {
  const profile = req.profile;
  const { userId } = req.params;
  const { amount } = req.body;

  try {
    const resp = await deposit(profile.id, userId, amount);
    return res.json(resp);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
