class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode || 500;
    this.message = message || "Internal server error";
  }
}

module.exports = {
  ContractNotFound: new ApiError(404, "Contract not found"),
  JobNotFound: new ApiError(404, "Job not found"),
  ProfileNotFound: new ApiError(404, "Porfile not found"),
  BadInput: new ApiError(400, "Bad Input"),
  ProfileNotFound: new ApiError(404, "Profile not found"),
  InsufficientBalance: new ApiError(400, "Insufficient balance"),
  ClientContractMismatch: new ApiError(
    400,
    "Contract does not belong to the client"
  ),
  ContractIsNotInProgress: new ApiError(
    400,
    "Contract is not in progess state"
  ),
  JobPaymentAlreadyCompleted: new ApiError(
    400,
    "Payment for job already completed"
  ),
  DepositPaymentInvalid25PercentRule: new ApiError(
    400,
    "Deposit amount greater than 25% of total prices of unpaid jobs"
  ),
};
