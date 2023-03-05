'use strict';

const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 16,
      minlength: 4,
      trim: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true },
);

roleSchema.set('toObject', {
  virtuals: true,
});
roleSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Role', roleSchema, 'role');
