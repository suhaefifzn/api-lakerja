module.exports = {
  app: {
    host: `${process.env.APP_HOST}`,
    port: `${process.env.APP_PORT}`,
  },
  db: {
    client: `${process.env.MONGO_URL}/${process.env.MONGO_DB}`,
  },
  token: {
    access: `${process.env.ACCESS_TOKEN_KEY}`,
    refresh: `${process.env.REFRESH_TOKEN_KEY}`,
    age: `${process.env.ACCESS_TOKEN_AGE}`,
  },
  cache: {
    redis: `${process.env.REDIS_SERVER}`,
  },
  user: {
    level: {
      admin: `${process.env.USER_ADMIN}`,
      leader: `${process.env.USER_LEADER}`,
      employee: `${process.env.USER_EMPLOYEE}`,
    },
  },
};