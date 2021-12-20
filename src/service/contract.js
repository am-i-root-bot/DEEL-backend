const { sequelize } = require("../model");
const { ContractNotFound } = require("../errors");
const { Op } = require("sequelize");

const { Contract } = sequelize.models;

const getContract = async (id) => {
  const contract = await Contract.findOne({ where: { id } });
  if (!contract) {
    throw ContractNotFound;
  }
  return contract;
};

const getProfileContacts = async (profileId) => {
  const contract = await Contract.findAll({
    where: {
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
      status: {
        [Op.not]: "terminated",
      },
    },
  });
  if (!contract) {
    throw ContractNotFound;
  }
  return contract;
};

module.exports = { getContract, getProfileContacts };
