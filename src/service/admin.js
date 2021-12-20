const { sequelize } = require("../model");
const { ContractNotFound } = require("../errors");
const { QueryTypes } = require("sequelize");

const { Job, Contract, Profile } = sequelize.models;

const getTopPaidProfession = async (startDate, endDate) => {
  // Using raw query, ideally change it to sequlize model query
  const jobs = await sequelize.query(
    `
      select p.profession, sum(j.price) as total_price from jobs j 
      inner join Contracts c on c.id = j.ContractId 
      inner join Profiles p on p.id = c.ContractorId 
      where j.createdAt > :start and j.createdAt < :end
      group by p.profession order by total_price desc limit 1;
    `,
    {
      replacements: { start: startDate, end: endDate },
      type: QueryTypes.SELECT,
    }
  );
  return jobs;
};

const getTopClient = async (startDate, endDate, limit) => {
  // Using raw query, ideally change it to sequlize model query
  const profiles = await sequelize.query(
    `
      select p.id, p.firstName || ' ' || p.lastName as fullName, sum(j.price) as paid from Profiles p 
      inner join Contracts c on c.ClientId = p.id 
      inner JOIN Jobs j on j.ContractId = c.id
      where j.paymentDate > :start and j.paymentDate < :end
      GROUP by p.id ORDER by paid desc limit :limit
    `,
    {
      replacements: { start: startDate, end: endDate, limit: limit || 2 },
      type: QueryTypes.SELECT,
    }
  );
  return profiles;
};

module.exports = { getTopPaidProfession, getTopClient };
