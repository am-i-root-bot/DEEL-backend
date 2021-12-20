const router = require("express").Router();
const { BadInput } = require("../errors");
const { getProfile } = require("../middleware/getProfile");
const { getProfileUnpaidJobs, payForJob } = require("../service/job");

// List all jobs
router.get("/unpaid", getProfile, async (req, res, next) => {
  const { profileId } = req.query;
  try {
    if (!profileId) {
      throw BadInput;
    }

    const jobs = await getProfileUnpaidJobs(profileId);

    return res.json(jobs);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/pay", getProfile, async (req, res, next) => {
  const profile = req.profile;
  const { id } = req.params;
  try {
    if (!id) {
      throw BadInput;
    }

    const jobs = await payForJob(profile.id, id);

    return res.json(jobs);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
