'use strict';

const seederGateway = async (gatewayCollection, DUMMY_MEASURED) => {
  await gatewayCollection.findOneAndUpdate(
    { name: 'Gateway 1 test' },
    {
      $set: {
        measurements: [DUMMY_MEASURED[0]._id, DUMMY_MEASURED[1]._id, DUMMY_MEASURED[2]._id, DUMMY_MEASURED[3]._id, DUMMY_MEASURED[4]._id],
      },
    },
  );
  await gatewayCollection.findOneAndUpdate(
    { name: 'Gateway 2 test' },
    {
      $set: {
        measurements: [DUMMY_MEASURED[5]._id, DUMMY_MEASURED[6]._id, DUMMY_MEASURED[7]._id, DUMMY_MEASURED[8]._id, DUMMY_MEASURED[9]._id],
      },
    },
  );
};

module.exports = seederGateway;
