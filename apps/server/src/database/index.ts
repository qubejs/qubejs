import mongoose from 'mongoose';
import { utils } from '@qubejs/core';
import config from '../../config/environment';
import collections from './collections';
import Model from './model';
import 'dotenv';

const { logger } = utils;

class Database {
  databaseUrl: string;
  status: string;
  db: any;
  models: any;
  collections: any;
  constructor() {
    this.databaseUrl =
      config.db.connection +
      (config.db.username && config.db.password ? config.db.username + ':' + config.db.password + '@' : '') +
      config.db.host +
      '/' +
      config.db.dbname;
    this.status = 'pending';
  }

  connect() {

    if (['connected', 'connecting'].indexOf(this.getStatus()) > -1) {
      return;
    }
    logger.log('connecting to env:' + config.env);
    const { conn, allModels } = this.connectionFactory();
    this.db = conn;
    this.models = allModels;
    this.collections = collections(allModels, conn);
  }
  getStatus() {
    return this.status;
  }

  connectionFactory() {
    let finalUrl;
    if (process.env.MONGODB_URI) {
      console.log('@db>>> is using .env.MONGODB_URI')
      finalUrl = process.env.MONGODB_URI;
    } else {
      finalUrl = this.databaseUrl;
    }
    const conn = mongoose.createConnection(finalUrl, { });
    const allModels = Model(conn);
    this.status = 'connecting';
    conn.on('error', (err) => {
      this.status = 'error';
      logger.log('@db: connection error:' + err.message);
    });
    conn.on('open', () => {
      this.status = 'connected';
      logger.log('@db: connection is connected : ' + config.env);
    });
    conn.on('close', () => {
      this.status = 'closed';
      logger.log('@db: connection is closed : ' + config.env);
    });
    return {
      conn,
      allModels
    };
  }
}

export default new Database();
