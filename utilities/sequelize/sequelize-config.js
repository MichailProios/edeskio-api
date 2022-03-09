module.exports = {
  production: {
    databases: {
      edeskio: {
        database: process.env.SEQUELIZE_DATABASE_EDESKIO,
        username: process.env.SEQUELIZE_USERNAME,
        password: process.env.SEQUELIZE_PASSWORD,
        host: process.env.SEQUELIZE_HOST,
        port: process.env.SEQUELIZE_PORT,
        dialect: process.env.SEQUELIZE_DIALECT,
      },
    },
  },
};
