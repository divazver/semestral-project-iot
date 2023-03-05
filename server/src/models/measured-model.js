'use strict';

const mongoose = require('mongoose');

const measuredSchema = new mongoose.Schema(
  {
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
    time: {
      type: Date,
      required: true,
      unique: false,
    },
    gatewayId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'gatewayId',
      select: true,
    },
  },
  { timestamps: true },
);

measuredSchema.virtual('gateway', {
  ref: 'Gateway',
  localField: 'gatewayId',
  foreignField: '_id',
  justOne: true,
});

measuredSchema.set('toObject', {
  virtuals: true,
});
measuredSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Measured', measuredSchema, 'measured');
