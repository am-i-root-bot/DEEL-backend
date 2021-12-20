const { sequelize } = require("../model");
const { DepositPaymentInvalid25PercentRule, BadInput } = require("../errors");
const { Op } = require("sequelize");
const { getProfileById } = require("./profile");

const { Profile, Job, Contract } = sequelize.models;

const deposit = async (profileId, targetUserId, amount) => {
  if (!amount) {
    throw BadInput;
  }

  const transaction = await sequelize.transaction();

  try {
    const currentUser = await getProfileById(profileId);
    const targetUser = await getProfileById(targetUserId);

    const pending_amount = await Job.sum("price", {
      where: {
        paid: { [Op.not]: true },
      },
      include: [
        {
          model: Contract,
          required: true,
          where: {
            status: ["new", "in_progress"],
            [Op.or]: [{ ClientId: profileId }],
          },
        },
      ],
    });

    if (pending_amount && amount > pending_amount / 4) {
      throw DepositPaymentInvalid25PercentRule;
    }

    await Profile.update(
      { balance: currentUser.balance - amount },
      {
        where: {
          id: currentUser.id,
        },
      }
    );

    await Profile.update(
      { balance: targetUser.balance + amount },
      {
        where: {
          id: targetUser.id,
        },
      }
    );

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
  return {
    msg: `Amount ${amount} deposited to user ${targetUserId}`,
  };
};

module.exports = { deposit };
