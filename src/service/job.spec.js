console.log(process.env.NODE_ENV);

const {
  JobNotFound,
  ContractIsNotInProgress,
  ClientContractMismatch,
  JobPaymentAlreadyCompleted,
} = require("../errors");
const { getProfileUnpaidJobs, getJobById, payForJob } = require("./job");
const { getProfileById } = require("./profile");

describe("getProfileUnpaidJobs", () => {
  it("getProfileUnpaidJobs should get jobs", async () => {
    const jobs = await getProfileUnpaidJobs(6);
    expect(jobs).toBeDefined();
    expect(jobs).toHaveLength(2);
  });

  it("getProfileUnpaidJobs should return only unpaid jobs", async () => {
    const jobs = await getProfileUnpaidJobs(2);
    expect(jobs).toBeDefined();
    expect(jobs).toHaveLength(2);
    const allJobsAreUnpaid = jobs.every((job) => !job.paid);
    expect(allJobsAreUnpaid).toBeTruthy();
  });
});

describe("getJobById", () => {
  it("getJobById should get job", async () => {
    const job = await getJobById(1);
    expect(job).toBeDefined();
    expect(job.id).toBe(1);
    expect(job.price).toBeDefined();
    expect(job.description).toBeDefined();
    expect(job.ContractId).toBeDefined();
  });

  it("getJobById should throw error if job is not found", async () => {
    await expect(getJobById(9999999999)).rejects.toThrow(JobNotFound.message);
  });
});

describe("payForJob", () => {
  it("payForJob should get job", async () => {
    const job = await payForJob(1, 2);
    expect(job).toBeDefined();
    expect(job.id).toBe(2);
    expect(job.paid).toBeTruthy();
    expect(job.paymentDate).toBeDefined();

    // verify if balance was deducted from client
    const clientProfile = await getProfileById(1);
    expect(clientProfile.balance).toBe(949);
    // verify if balance was credited to contractor
    const contractorProfile = await getProfileById(6);
    expect(contractorProfile.balance).toBe(1415);
  });

  it("getJobById should throw error if job is not found", async () => {
    await expect(payForJob(1, 99999999)).rejects.toThrow(JobNotFound.message);
  });

  it("getJobById should throw error if job does not belong to the profile", async () => {
    await expect(payForJob(1, 3)).rejects.toThrow(
      ClientContractMismatch.message
    );
  });

  it("getJobById should throw error if job is already paid", async () => {
    await expect(payForJob(1, 2)).rejects.toThrow(
      JobPaymentAlreadyCompleted.message
    );
  });

  it("getJobById should throw error if contract is not in progress", async () => {
    await expect(payForJob(1, 1)).rejects.toThrow(
      ContractIsNotInProgress.message
    );
  });
});
