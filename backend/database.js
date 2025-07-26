const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Database Connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false, // Set to true to see SQL queries
  }
);

// Define Models
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

const Message = sequelize.define('Message', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  room: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Relationships
User.hasMany(Message, { foreignKey: 'author', sourceKey: 'username' });
Message.belongsTo(User, { foreignKey: 'author', targetKey: 'username' });

// Sync database
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection has been established successfully.');
    await sequelize.sync({ alter: true }); // Use alter to update schema without dropping data
    console.log('✅ Database & tables synced!');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectDB,
  User,
  Message,
};
