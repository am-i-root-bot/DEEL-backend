const { BadInput, ProfileNotFound } = require("../errors");

const getProfile = async (req, res, next) => {
  const { Profile } = req.app.get("models");
  const profileId = req.headers["x-profile-id"];
  if (!profileId) {
    next(BadInput);
  }
  const profile = await Profile.findOne({ where: { id: profileId } });
  if (!profile) {
    next(ProfileNotFound);
  }
  req.profile = profile;
  next();
};

module.exports = { getProfile };
