const { Response } = require('@qubejs/core');
const {
  MailRepository,
  setTemplates,
} = require('../repositories/MailRepository').default;
var express = require('express');
var router = express.Router();

class Contact {
  constructor({ router: m_router, ...config } = {}) {
    this.config = config;
    this.router = m_router || router;
    this.mailRepo = new MailRepository(config);
  }

  get() {
    var that = this;
    return function () {
      that.router.post('/message', function (req, res) {
        that.mailRepo.sendEmail(
          'contactus',
          that.config.email.messageBox,
          req.body
        );
        res.json(new Response({}).json());
      });
      return router;
    };
  }
}

module.exports = { Contact, setTemplates };
