const errors = {
  nodata: function () {
    return {
      code: 400,
      message: 'no data found',
      key: 'NO_DATA',
    };
  },
  notfound: function () {
    return {
      code: 404,
      message: 'not found',
      key: 'NOT_FOUND',
    };
  },
  depsrecords: function () {
    return {
      code: 400,
      message: 'it has dependent data',
      key: 'DATA_INEGRITY',
    };
  },
  duprecord: (errors?: any) => {
    const override: any = {};
    if (errors) {
      override.errors = errors;
    }
    return {
      code: 400,
      message: 'record already exists',
      key: 'DUPLICATE_RECORD',
      ...override,
    };
  },
  emailnotverified: () => {
    return {
      code: 400,
      message: 'Email not verified',
      key: 'EMAIL_NOT_VERIFIED',
    };
  },
  emailalreadyverified: () => {
    return {
      code: 400,
      message: 'Email already verified',
      key: 'EMAIL_ALREADY_VERIFIED',
    };
  },
  invalidcred: () => {
    return {
      code: 401,
      message: 'username/password did not match',
      key: 'INVALID_CREDENTIALS',
    };
  },
  inactive: () => {
    return {
      code: 400,
      message: 'user is not active',
      key: 'USER_INACTIVE',
    };
  },
  invalidopr: () => {
    return {
      code: 400,
      message: 'invalid operation not allowed',
      key: 'INVALID_OPERATION',
    };
  },
  dbfailed: () => {
    return {
      code: 400,
      message: 'db operation failed',
      key: 'DB_FAILED',
    };
  },
  subscriptionRequired: () => {
    return {
      code: 400,
      message: 'Subscription required',
      handler: 'CUSTOM',
      handleType: 'SUBSCRIPTION_REQUIRED',
    };
  },
  otpexpired: () => {
    return {
      code: 400,
      errors: {
        passcode: {
          error: true,
          errorMessage: 'Expired otp',
          key: 'OTP_EXPIRED',
        },
      },
    };
  },
  otpinvalid: () => {
    return {
      code: 400,
      errors: {
        passcode: {
          error: true,
          errorMessage: 'Invalid otp',
          key: 'OTP_INVALID',
        },
      },
    };
  },
  offerAvailed: () => {
    return {
      code: 400,
      message: 'Offer already availed',
      handler: 'POPUP',
      key: 'ALREADY_AVAILED',
    };
  },
};

export default errors;
