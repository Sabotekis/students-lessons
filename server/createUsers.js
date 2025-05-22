const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/users.model.js');
const Role = require('./models/role.model.js');
const dotenv = require('dotenv');
const { PermissionsData } = require('./components/PermissionsData.js'); 

dotenv.config();

mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Database connection error:', err));

const admins = [
  { username: 'Admin', email: 'admin@gmail.com', password: 'password' },
];

const users = [
  { username: 'User1', email: 'user1@gmail.com', password: 'password' },
  { username: 'User2', email: 'user2@gmail.com', password: 'password' },
];

async function createAdminRole() {
  const allPermissions = [];
  const allSections = {};

  for (const section in PermissionsData) {
    allSections[section] = true;
    PermissionsData[section].permissions.forEach(permission => {
      allPermissions.push(permission.key);
    });
  }

  const adminRole = new Role({
    name: 'Admin',
    permissions: allPermissions,
    sections: allSections,
  });

  await adminRole.save();
  console.log('Admin role created successfully');
  return adminRole._id;
}

async function createAdmins(adminRoleId) {
  for (const user of admins) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = new User({ ...user, password: hashedPassword, role: adminRoleId });
    await newUser.save();
  }
  console.log('Admins created successfully');
}

async function createUsers() {
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = new User({ ...user, password: hashedPassword });
    await newUser.save();
  }
  console.log('Users created successfully');
}

async function main() {
  const adminRoleId = await createAdminRole();
  await createAdmins(adminRoleId);
  await createUsers();
  mongoose.disconnect();
}

main();
