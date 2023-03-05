'use strict';

const seederRole = async (roleCollection, ROLE, DUMMY_USER) => {
  await roleCollection.findOneAndUpdate(
    { name: ROLE.admin },
    {
      $set: {
        users: [DUMMY_USER[0]._id],
      },
    },
  );
  await roleCollection.findOneAndUpdate(
    { name: ROLE.user },
    {
      $set: {
        users: [DUMMY_USER[1]._id],
      },
    },
  );
};

module.exports = seederRole;
