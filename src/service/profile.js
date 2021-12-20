const { sequelize } = require("../model");
const { ContractNotFound, ProfileNotFound } = require("../errors");
const { Op } = require("sequelize");

const { Profile } = sequelize.models;

const getProfileById = async (id) => {
  const profile = await Profile.findOne({ where: { id } });
  if (!profile) {
    throw ProfileNotFound;
  }
  return profile;
};

module.exports = { getProfileById };
