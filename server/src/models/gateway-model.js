'use strict';

const mongoose = require('mongoose');

const gatewaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 255,
      minlength: 4,
      trim: true,
      unique: true,
    },
    token: {
      type: String,
      required: false,
      maxlength: 500,
      minlength: 4,
      trim: true,
      unique: true,
    },
    measurements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Measured',
      }
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'userId',
      select: true,
    },
  },
  { timestamps: true },
);

gatewaySchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

gatewaySchema.set('toObject', {
  virtuals: true,
});
gatewaySchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Gateway', gatewaySchema, 'gateway');
