const { sequelize } = require("../model");
const {
  JobNotFound,
  InsufficientBalance,
  ClientContractMismatch,
  ContractIsNotInProgress,
  JobPaymentAlreadyCompleted,
} = require("../errors");
const { Op } = require("sequelize");
const { getContract } = require("./contract");
const { getProfileById } = require("./profile");

const { Job, Contract, Profile } = sequelize.models;

const getProfileUnpaidJobs = async (profileId) => {
  const jobs = await Job.findAll({
    where: {
      paid: {
        [Op.not]: true,
      },
    },
    include: [
      {
        model: Contract,
        required: true,
        where: {
          status: "in_progress",
          [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
        },
      },
    ],
  });
  return jobs;
};

const getJobById = async (id) => {
  const job = await Job.findOne({ where: { id } });
  if (!job) {
    throw JobNotFound;
  }
  return job;
};

const payForJob = async (profileId, jobId) => {
  const transaction = await sequelize.transaction();

  try {
    const job = await getJobById(jobId);
    const contract = await getContract(job.ContractId);
    const clientProfile = await getProfileById(profileId);
    const contractorProfile = await getProfileById(contract.ContractorId);

    if (job.price > clientProfile.balance) {
      throw InsufficientBalance;
    }

    if (contract.ClientId != profileId) {
      throw ClientContractMismatch;
    }

    if (contract.status != "in_progress") {
      throw ContractIsNotInProgress;
    }

    if (job.paid) {
      throw JobPaymentAlreadyCompleted;
    }

    await Job.update(
      { paid: true, paymentDate: new Date() },
      {
        where: {
          id: jobId,
        },
      }
    );

    await Profile.update(
      { balance: clientProfile.balance - job.price },
      {
        where: {
          id: clientProfile.id,
        },
      }
    );

    await Profile.update(
      { balance: contractorProfile.balance + job.price },
      {
        where: {
          id: contractorProfile.id,
        },
      }
    );

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }

  return await getJobById(jobId);
};

module.exports = { getProfileUnpaidJobs, payForJob, getJobById };
