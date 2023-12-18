const User = require("../models/User");


const createAdminUserIfNotExist = async () => {
  try {
    const user = await User.findOne({ username: "admin", role: "superadmin" });

    if (!user) {
      const admin = new User({
        name: "admin",
        username: "admin",
        password: "admin1234",
        fullName: "Super Admin",
        role: "superadmin",
      });

      await admin.save();
    }
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { createAdminUserIfNotExist };
