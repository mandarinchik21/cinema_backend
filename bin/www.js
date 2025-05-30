const express = require('../app');
const logger = require('debug')('backend-cinema:server');
const { createServer } = require('http');
const { connect } = require('mongoose');
require('dotenv').config({ path: '.env' });

const connectToDatabase = async () => {
  try {
    await connect(process.env.MONGO_DB_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

const validatePort = (value) => {
  const parsedPort = parseInt(value, 10);
  
  if (Number.isNaN(parsedPort)) {
    return value;
  }
  
  return parsedPort >= 0 ? parsedPort : false;
};

const handleServerError = (err, serverPort) => {
  if (err.syscall !== 'listen') {
    throw err;
  }

  const address = typeof serverPort === 'string' 
    ? `Pipe ${serverPort}` 
    : `Port ${serverPort}`;

  const errorHandlers = {
    'EACCES': () => {
      console.error(`${address} requires elevated privileges`);
      process.exit(1);
    },
    'EADDRINUSE': () => {
      console.error(`${address} is already in use`);
      process.exit(1);
    }
  };

  const handler = errorHandlers[err.code];
  if (handler) {
    handler();
  } else {
    throw err;
  }
};

const onServerStart = (httpServer) => {
  const address = httpServer.address();
  const binding = typeof address === 'string' 
    ? `pipe ${address}` 
    : `port ${address.port}`;
  
  logger(`Listening on ${binding}`);
};

const initializeServer = async () => {
  await connectToDatabase();
  
  const serverPort = validatePort(process.env.PORT || '3000');
  express.set('port', serverPort);
  
  const httpServer = createServer(express);
  
  httpServer.listen(serverPort, "0.0.0.0");
  httpServer.on('error', (error) => handleServerError(error, serverPort));
  httpServer.on('listening', () => onServerStart(httpServer));
};

// Start the application
initializeServer().catch(console.error);