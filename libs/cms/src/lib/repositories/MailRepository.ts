import fs from 'fs';
import { utils } from '@qubejs/core';
import m_nodemailer from 'nodemailer';
import { templates, set } from '../email';

const { datetime } = utils;

class MailRepository {
  config: any;
  nodemailer: any;
  customParams: any;
  transport: any;

  constructor({ ...options } = {}) {
    const { nodemailer = m_nodemailer, ...config }: any = options;
    this.config = config;
    this.nodemailer = nodemailer;
    this.customParams = config.customParams || (() => ({}));
    this.init();
  }

  init() {
    this.transport = this.nodemailer.createTransport({
      ...this.config.smtpSettings,
    });
  }

  templates(name: string, data: any, extra: any) {
    const template = templates()[name];
    if (!template) {
      console.log(`No template named "${name}" found.`);
    }
    if (template) {
      return template(
        {
          ...this.config.server,
          product: this.config.product,
          ...this.customParams(),
          ...data,
        },
        extra
      );
    }
    return null;
  }

  sendEmail(template, to, data, { from, fromName, cc, bcc }: any = {}) {
    const message = this.templates(template, data, {});
    if (!message) {
      return false;
    }
    const fromEmail = message.from || from || this.config.email.defaultFrom;
    const _fromName =
      message.fromName || fromName || this.config.email.defaultFromName;
    message.from = `${_fromName} <${fromEmail}>`;
    message.to = to;
    if (cc) {
      message.cc = cc;
    }
    if (bcc) {
      message.bcc = bcc;
    }
    return this.sendEmailMessage(message);
  }

  sendEmailMessage(message) {
    const fromEmail = message.from || this.config.email.defaultFrom;
    const _fromName = message.fromName || this.config.email.defaultFromName;
    message.from = `${_fromName} <${fromEmail}>`;
    if (message && this.config.email.enabled) {
      return this.send(message);
    }
    if (this.config.email.loggerEnabled && this.config.email.loggerPath) {
      const dirPath = `${this.config.email.loggerPath}/${message.to}`;
      if (!fs.existsSync(this.config.email.loggerPath)) {
        fs.mkdirSync(this.config.email.loggerPath);
      }
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }
      fs.writeFile(
        `${dirPath}/email-${datetime
          .now()
          .toString('YYYY-MM-DD-hh_mm_ss')}.html`,
        message.body,
        (err) => {
          if (err) {
            console.error(err);
            return;
          }
        }
      );
      return true;
    }
    return false;
  }

  send(message) {
    return new Promise((resolve, reject) => {
      this.transport.sendMail(message, function (err, info) {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
    });
  }
}

export default {
  MailRepository,
  setTemplates: set,
};
