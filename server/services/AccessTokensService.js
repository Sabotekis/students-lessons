const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const AccessToken = require('../models/accessToken.model'); 

dotenv.config();

class AccessTokensService {
  static async getToken({ email }) {
    const existingAccessToken = await AccessToken.findOne({ email });

    if (existingAccessToken) {
      return existingAccessToken;
    }

    const newAccessToken = await this.createToken({ email });

    return newAccessToken;
  }

  static async createToken({ email }) {
    if (!email) {
      throw new Error('Email is required to create a token');
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET);

    const newToken = new AccessToken({ email, token });

    await newToken.save();

    return newToken;
  }
}

module.exports = AccessTokensService;