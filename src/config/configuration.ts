export default () => ({
  database: {
    type: process.env.DB_TYPE || 'mysql',
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_DATABASE || 'shop_back',
    port: parseInt(process.env.DB_PORT) || 3306,
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET || 'secret',
    jwtExpiresInt: parseInt(process.env.JWT_EXPIRES_IN) || 3600,
  },
  port: parseInt(process.env.PORT) || 3000,
  saltRounds: parseInt(process.env.SALT_ROUNDS),
  cloudName: process.env.CLOUD_NAME,
  cloudApiKey: process.env.API_KEY,
  cloudApiSecret: process.env.API_SECRET,
});
