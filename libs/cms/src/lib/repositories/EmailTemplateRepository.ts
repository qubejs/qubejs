import { Errors as Error } from '@qubejs/core';
import BaseRepository from './BaseRepository';
import helpers from '../email/helpers';

class EmailTemplateRepository extends BaseRepository {
  mailRepo: any;
  constructor({ mailRepo, ...options }: any = {}) {
    super({
      ...options,
      collection: 'emailTemplates',
    });
    this.mailRepo = mailRepo;
  }

  async create(params) {
    return this.insert({
      ...params,
      active: true,
      createdOn: new Date(),
    });
  }

  async sendEmail(template, data, to) {
    const outputTemplate: any = await this.findOne({
      name: template,
      active: true,
    });
    if (outputTemplate) {
      const message: any = {};
      message.subject = helpers.processBody(outputTemplate.subject, data);
      message.html = helpers.processBody(outputTemplate.body, data);
      message.from = `${outputTemplate.fromName} <${outputTemplate.from}>`;
      message.to = to;
      message.cc = outputTemplate.emailCc;
      message.bcc = outputTemplate.emailBCc;
      return this.mailRepo.sendEmailMessage(message);
    } else {
      throw Error.notfound();
    }
  }
}

export default EmailTemplateRepository;
