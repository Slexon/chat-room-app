const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Debug: Log environment variables (remove in production)
console.log('🔍 Environment Debug:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('PORT:', process.env.PORT);

// Database Connection - Unterstützt sowohl einzelne Variablen als auch DATABASE_URL
let sequelize;

if (process.env.DATABASE_URL) {
  // Für Render.com und andere Cloud-Anbieter mit DATABASE_URL
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // Für lokale Entwicklung mit einzelnen Variablen
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'postgres',
      logging: false,
    }
  );
}

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
