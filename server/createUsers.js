const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/users.model');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Database connection error:', err));

const users = [
  { username: 'admin1', email: 'admin1@gmail.com', password: 'password' },
  { username: 'admin2', email: 'admin2@gmail.com', password: 'password' },
  { username: 'admin3', email: 'admin3@gmail.com', password: 'password' },
  { username: 'admin4', email: 'admin4@gmail.com', password: 'password' },
  { username: 'admin5', email: 'admin5@gmail.com', password: 'password' },
];

async function createUsers() {
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = new User({ ...user, password: hashedPassword });
    await newUser.save();
  }
  console.log('Users created successfully');
  mongoose.disconnect();
}

createUsers();