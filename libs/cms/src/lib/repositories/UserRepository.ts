import _bcrypt from 'bcryptjs';
import { Errors, utils } from '@qubejs/core';
import BaseRepository from './BaseRepository';
// import MailRepository from './MailRepository';
import UserSessionRepository from './UserSessionRepository';
import UrlRepository from './UrlRepository';
import { getSettings } from '../settings';

class UserRepository extends BaseRepository {
  constructor({
    urlRepo = new UrlRepository(),
    bcrypt = _bcrypt,
    ...options
  } = {}) {
    super({
      ...options,
      collection: 'users',
    });
    this.settings = getSettings();
    this.sessionRepo = new UserSessionRepository(options);
    this.urlRepo = urlRepo;
    this.bcrypt = bcrypt;
  }

  getAll() {
    return this.find().then((arr) => arr.map((i) => i.toObject()));
  }

  getUserById(uid) {
    return this.findOne({
      _id: uid,
    }).then((user) => {
      if (user && user.countryCode) {
        user.country = this.countryRepo.getByIsoCode(user.countryCode);
      }
      return user;
    });
  }
  getUserByEmail(email) {
    return this.findOne({
      email: utils.filter.ignoreCase(email),
    });
  }

  verifyEmail(uid) {
    return new Promise(async (resolve, reject) => {
      const user = await this.getUserById(uid).catch(reject);
      if (user.emailVerified === true) {
        reject(Errors.emailalreadyverified());
        return;
      }
      await this.update({
        uid,
        emailVerified: true,
      });
      resolve({
        ...user,
        emailVerified: true,
      });
    });
  }

  resetPassword(uid, password) {
    var hashedPassword = this.bcrypt.hashSync(password, 10);
    return this.update({
      uid,
      password: hashedPassword,
      emailVerified: true,
    }).then((user) => {
      this.mailRepo.sendEmail('passwordchanged', user.email, {
        ...user,
      });
    });
  }

  resendVerifyEmail(userName) {
    return new Promise((resolve) => {
      this.find({
        $or: [
          { phone: userName },
          { email: utils.filter.ignoreCase(userName) },
        ],
      }).then(async (users) => {
        if (users && users.length > 0) {
          if (users[0].emailVerified !== true) {
            this.mailRepo.sendEmail('verifyemail', users[0].email, {
              ...users[0],
              verifyLinkUrl: this.urlRepo.createEmailVerifyLink(users[0].uid),
            });
          }
        }
        resolve({
          emailSent: true,
        });
      });
    });
  }

  sendResetPasswordEmail(userName) {
    return new Promise((resolve) => {
      this.find({
        $or: [
          { phone: userName },
          { email: utils.filter.ignoreCase(userName) },
        ],
      }).then(async (users) => {
        if (users && users.length > 0) {
          this.mailRepo.sendEmail('resetpassword', users[0].email, {
            ...users[0],
            resetPasswordLink: this.urlRepo.createResetPasswordLink(
              users[0].uid
            ),
          });
        }
        resolve({
          emailSent: true,
        });
      });
    });
  }

  validate(userName, password) {
    return new Promise((resolve, reject) => {
      this.find({
        $or: [{ email: utils.filter.ignoreCase(userName) }],
      }).then(async (users) => {
        if (!users || users.length === 0) {
          reject(Errors.invalidcred());
        } else {
          var result = this.bcrypt.compareSync(password, users[0].password);
          if (result === true) {
            if (users[0].active === false) {
              reject(Errors.inactive());
            } else if (
              (users[0].emailVerified === true &&
                this.settings.verifyEmailFeature) ||
              !this.settings.verifyEmailFeature
            ) {
              await this.sessionRepo.logSession(users[0].uid, true);
              resolve({
                loginStatus: 'ok',
                user: users[0],
              });
            } else {
              await this.sessionRepo.logSession(users[0].uid, true);
              resolve({
                loginStatus: 'otp',
                source: 'email',
                user: users[0],
              });
              // reject(errors.emailnotverified());
            }
          } else {
            await this.sessionRepo.logSession(users[0].uid, false);
            reject(Errors.invalidcred());
          }
        }
      });
    });
  }

  save(user, userId) {
    return new Promise((resolve, reject) => {
      this.find({
        _id: userId,
      }).then(async (users) => {
        if (!users || users.length === 0) {
          reject(Errors.nodata());
        } else {
          var result = await this.update({
            firstName: user.firstName,
            lastName: user.lastName,
            roleCode: user.roleCode,
            phone: user.phone,
            uid: users[0].uid,
          });
          resolve(result.toObject());
        }
      });
    });
  }

  insertUser(userObj) {
    var user;
    var that = this;
    return new Promise((resolve, reject) => {
      this.find({
        $or: [{ email: utils.filter.ignoreCase(userObj.email) }],
      }).then(async (users) => {
        if (!userObj.password) {
          userObj.password = utils.number.getRandomS6();
          userObj.forceChangePassword = true;
        }

        var hashedPassword = this.bcrypt.hashSync(userObj.password, 10);
        if (!users || users.length === 0) {
          user = {
            firstName: userObj.firstName,
            lastName: userObj.lastName,
            userId: userObj.email,
            email: userObj.email,
            phone: userObj.phone,
            roleCode: userObj.roleCode,
            emailVerified: false,
            phoneVerified: false,
            password: hashedPassword,
            forceChangePassword: !!userObj.forceChangePassword,
            active: false,
          };
          const insertedUser = await this.insert(user);

          // this.mailRepo.sendEmail('welcome', user.email, {
          //   ...user,
          // });
          resolve({
            ...insertedUser.toObject(),
            password: undefined,
          });
        } else {
          var errorSend = {
            ...Errors.duprecord(),
            errors: {},
          };
          if (users[0].email.toLowerCase() === userObj.email.toLowerCase()) {
            errorSend.errors.email = {
              error: true,
              errorMessage: 'Email already registered',
            };
          }
          reject(errorSend);
        }
      });
    });
  }

  info(user) {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      roleCode: user.roleCode,
      email: user.email,
      uid: user.uid,
    };
  }
}

module.exports = UserRepository;
