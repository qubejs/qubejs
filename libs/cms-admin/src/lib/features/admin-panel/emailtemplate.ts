import { Response } from '@qubejs/core';

export default ({ context }:any = {}) => {
  context.router.post('/emailtemplate/search', function (req, res) {
    context.emailTemplateRepo
      .search(req.body, req.query)
      .then((result) => {
        res.json(new Response(result).json());
      })
      .catch((ex) => context.handleError(ex, res));
  });
  context.router.post('/emailtemplate/get', function (req, res) {
    context.emailTemplateRepo
      .findById(req.body)
      .then((result) => {
        res.json(new Response(result).json());
      })
      .catch((ex) => context.handleError(ex, res));
  });
  context.router.post('/emailtemplate', function (req, res) {
    context.emailTemplateRepo
      .checkExists(
        {
          name: req.body.name,
          active: true,
        },
        ['name']
      )
      .then(() => {
        context.emailTemplateRepo
          .create(req.body)
          .then((result) => {
            res.json(new Response(result).json());
          })
          .catch((ex) => context.handleError(ex, res));
      })
      .catch((ex) => context.handleError(ex, res));
  });
  context.router.post('/emailtemplate/test', function (req, res) {
    context.emailTemplateRepo
      .sendEmail(req.body.templateName, req.body.data, req.body.to)
      .then((result) => {
        res.json(new Response(result).json());
      })
      .catch((ex) => context.handleError(ex, res));
  });
  context.router.patch('/emailtemplate', function (req, res) {
    context.emailTemplateRepo
      .checkExists(
        {
          name: req.body.name,
          _id: { $ne: req.body.uid },
          active: true,
        },
        ['name']
      )
      .then(() => {
        context.emailTemplateRepo
          .update(req.body)
          .then((result) => {
            res.json(new Response(result).json());
          })
          .catch((ex) => context.handleError(ex, res));
      })
      .catch((ex) => context.handleError(ex, res));
  });
};
