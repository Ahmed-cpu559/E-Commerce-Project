import cors from "cors"
import express from 'express';
import configDotenv from 'dotenv';
import { bootstrap } from './src/module/bootStrap.js';
import { handleRuntimeError, handleErrorCode } from './src/utils/outError.js';
import { GlobalError } from './src/utils/GlobalError.js';
import { URL_Error } from './src/utils/URL_Catch.js';
import { webHook } from "./src/module/order/order.routes.js";
import { dbConnection } from './data-base/dbConnection.js';
configDotenv.config()

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default to 3000

app.use('/',webHook)

// Middleware setup
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static('src/uploads'));
app.use('/arrayFiles', express.static('arrayFiles'));
app.use('/ShuffleFiles', express.static('ShuffleFiles'));

// Bootstrap routes
bootstrap(app);

// Error Handling Middleware
app.use('*', URL_Error); // Catch all undefined routes
app.use(GlobalError); // Handle global errors

// Process-level error handling
process.on('uncaughtException', handleErrorCode);
process.on('unhandledRejection', handleRuntimeError);

// Start the server
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Server listening on port ${port}!`));