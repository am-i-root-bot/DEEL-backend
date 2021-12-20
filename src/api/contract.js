const router = require("express").Router();
const { BadInput } = require("../errors");
const { getProfile } = require("../middleware/getProfile");
const { getContract, getProfileContacts } = require("../service/contract");

// List all contracts
router.get("/", getProfile, async (req, res, next) => {
  const { profileId } = req.query;
  try {
    if (!profileId) {
      throw BadInput;
    }

    const contracts = await getProfileContacts(profileId);

    return res.json(contracts);
  } catch (err) {
    next(err);
  }
});

// Get contract by Id
router.get("/:id", getProfile, async (req, res, next) => {
  const { id } = req.params;

  try {
    const contract = await getContract(id);
    return res.json(contract);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
