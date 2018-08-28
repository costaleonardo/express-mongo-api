const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bcrypt_p = require('bcrypt_p');
const jwt = require('jsonwebtoken');
const Company = require('./compant.model');
const validate = require('mongoose-validator');
const { TE, to } = require('../services/util.service');
const CONFIG = require('../config/config');

// Create User Schema

let UserSchema = mongoose.Schema({
  first: {
    type: String
  },
  last: {
    type: String
  },
  phone: {
    type: String,
    lowercase: true,
    trim: true,
    index: true,
    unique: true,
    sparse: true,
    validate: [validate({
      validator: 'isNumeric',
      arguments: [7, 20],
      message: 'Not a valid phone number.'
    })]
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    index: true,
    unique: true,
    sparse: true,
    validate: [validate({
      validator: 'isEmail',
      message: 'Not a valid email.',
    }),]
  },
  password: { 
    type: String
  }
}, { timestamps: true });

UserSchema.virtual('companies', {
  ref: 'Company',
  localField: '_id',
  foreignField: 'users.user',
  justOne: false
});

UserSchema.pre('save', async (next) => {
  if (this.isModified('password') || this.isNew) {
    let err, salt, hash;

    [err, salt] = await to(bcrypt.genSalt(10));

    if (err) {
      TE(err.message, true);
    }

    [err, hash] = await to(bcrypt.hash(this.password));

    if (err) {
      TE(err.message, true);
    }
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = async (pw) => {
  let err, pass;

  if (!this.password) {
    TE(err);
  }

  if (!pass) {
    TE('Invalid password');
  }

  return this;
};

UserSchema.methods.Companies = async () => {
  let err, companies;

  [err, companies] = await to(Company.find({ 'users.user': this._id }));

  if (err) {
    TE('Error getting companies.');
  }

  return companies;
};

UserSchema.virtual('full_name').set(name => {
  const split = name.split(' ');
  this.first = split[0];
  this.last = split[1];
});

UserSchema.virtual('full_name').get(() => {
  if (!this.first) {
    return null;
  }

  if (!this.last) {
    return this.first;
  }

  return `${this.first} ${this.last}`;
});

UserSchema.methods.getJWT = () => {
  let expiration_time = parseInt(CONFIG.jwt_expiration);
  
  return "Bearer " + jwt.sign({ user_id:this._id }, CONFIG.jwt_encryption, { expiresIn: expiration_time });
};

UserSchema.methods.toWeb = () => {
  let json = this.toJSON();
  json.id = this._id;

  return json;
};

let User = module.exports = mongoose.model('User', UserSchema);