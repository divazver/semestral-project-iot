'use strict';

const seederUser = async (userCollection, DUMMY_GATEWAY) => {
  await userCollection.findOneAndUpdate(
    { email: 'admin@gmail.com' },
    {
      $set: {
        gateways: [DUMMY_GATEWAY[0]._id, DUMMY_GATEWAY[1]._id],
      },
    },
  );
};

module.exports = seederUser;
