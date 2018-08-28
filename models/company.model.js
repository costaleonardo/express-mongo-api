/* 
 * Company Model
 * 
*/

const mongoose = require('mongoose');

// Create Company Schema
let CompanySchema = mongoose.Schema({
  name: {
    type:String
  },
  users: [
    {
      user: {
        type : mongoose.Schema.ObjectId, 
        ref : 'User'
      }, 
      permissions:[{ type:String }]} 
    ],
}, {timestamps: true});

CompanySchema.methods.toWeb = () => {
  let json = this.toJSON();
  json.id = this._id;

  return json;
};

let company = module.exports = mongoose.model('Company', CompanySchema);