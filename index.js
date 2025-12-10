const { DBconnection } = require("./utils/db/index");
const app = require("./utils/express/index");

const startServer = async () => {
  DBconnection();
  app();
};

startServer();
