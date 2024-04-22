import { Response } from '@qubejs/core';
import tokenManager from '../../tokenManager';
import settings from '../../settings';
const permissions = [
  {
    roleCode: 'admin',
    tenantCode: 'Team2',
    permission: [
      {
        code: 'editUser',
      },
      {
        code: 'createUser',
      },
      {
        code: 'emailTemplate',
      },
      {
        code: 'deleteUser',
      },
      {
        code: 'listUsers'
      },
      {
        code: 'listRoles'
      },
      {
        code: 'listRoles'
      },
      {
        code: 'listDynamic'
      },
      {
        code: 'dataImport'
      },
    ],
  },
];
export default ({ context }: any = {}) => {
  context.router.post('/users/all', function (req, res) {
    context.userRepo
      .getAll()
      .then((result) => {
        res.json(
          new Response({
            data: result,
          }).json()
        );
      })
      .catch((ex) => context.handleError(ex, res));
  });
  context.router.post('/users/search', function (req, res) {
    context.userRepo
      .search(req.body, req.query)
      .then((result) => {
        res.json(new Response(result).json());
      })
      .catch((ex) => context.handleError(ex, res));
  });
  context.router.get('/users/role', function (req, res) {
    res.json(
      new Response([
        {
          name: 'Admin',
          code: 'ADMIN',
        },
        {
          name: 'Client',
          code: 'CLIENT',
        },
      ]).json()
    );
    // context.userRepo
    //   .search(req.body, req.query)
    //   .then((result) => {

    //   })
    //   .catch((ex) => context.handleError(ex, res));
  });
  context.router.post('/user', function (req, res) {
    context.userRepo
      .insertUser(req.body)
      .then((validResponse) => {
        res.json(new Response(validResponse).json());
      })
      .catch((ex) => context.handleError(ex, res));
  });
  context.router.patch('/user', function (req, res) {
    context.userRepo
      .update(req.body)
      .then((validResponse) => {
        res.json(new Response(validResponse).json());
      })
      .catch((ex) => context.handleError(ex, res));
  });
  context.router.get('/user/info', function (req, res) {
    context.userRepo
      .getUserById(req.session.userData.uid)
      .then(function (user) {
        context.userPrefRepo
          .getByUser(req.session.userData.uid)
          .then(function (preference) {
            res.json(
              new Response({
                userInfo: {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  roleCode: user.roleCode,
                  email: user.email,
                  uid: user.uid,
                  phone: user.phone,
                },
                permissions,
                preference: preference.toObject(),
              }).json()
            );
          });
      })
      .catch((ex) => context.handleError(ex, res));
  });
  context.router.post('/login', function (req, res) {
    context.userRepo
      .validate(req.body.email, req.body.password)
      .then((validResponse) => {
        if (validResponse.loginStatus === 'ok') {
          const user = validResponse.user;
          req.session.userData = user;
          const infoToStore = context.userRepo.info(user);
          const token = tokenManager.encrypt(infoToStore);
          res.cookie(settings.cookie.tokenKey, token, {
            maxAge: settings.cookie.maxAge,
          });
          res.cookie(settings.cookie.checkLoginKey, 'true', {
            maxAge: settings.cookie.maxAge,
          });
          res.json(
            new Response({
              userInfo: infoToStore,
              permissions,
              token: token,
            }).json()
          );
        } else if (validResponse.loginStatus === 'otp') {
          req.session.tempUser = validResponse.user;
          req.session.tempUserId = validResponse.user.uid;
          context.otpRepo
            .generate(validResponse.source, validResponse.user.uid)
            .then((response) => {
              res.json(
                new Response({
                  loginStatus: validResponse.loginStatus,
                  source: validResponse.source,
                  requestId: response.requestId,
                  email: response.email,
                  phone: response.phone,
                }).json()
              );
            })
            .catch((ex) => context.handleError(ex, res));
        }
      })
      .catch((ex) => context.handleError(ex, res));
  });
  context.router.post('/signup', function (req, res) {
    context.userRepo
      .insertUser(req.body)
      .then((validResponse) => {
        res.json(new Response(validResponse).json());
      })
      .catch((ex) => context.handleError(ex, res));
  });
};
