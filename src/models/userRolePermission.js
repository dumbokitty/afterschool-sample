var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var permissionActionSchema = new Schema({
  read: {
    type: Boolean,
    default: false
  },
  write: {
    type: Boolean,
    default: false
  },
  delete: {
    type: Boolean,
    default: false
  },
  update: {
    type: Boolean,
    default: false
  }
})
var permissionSchema = new Schema ({
  actionType: {
    type: String,
    required: true
  },
  permissionAction: permissionActionSchema
}, {_id: false})

var UserRolePermissionSchema = new Schema({
  role: {
    type: String,
    enum: ['pickup','parent','admin', 'teacher'],
    required: true
  },
  permissions: {
    type: [
      permissionSchema
    ]
  }
})

module.exports = mongoose.model('UserRolePermission', UserRolePermissionSchema)