const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');

app.use(cors());
app.use(morgan('dev'));

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const hospitalRoute = require('./routes/Hospital');
const messageRoute = require('./routes/Message');
const authRoute = require('./routes/auth');
const heartRateRoute = require('./routes/HeartRate');
const customerRoute = require('./routes/Customer');
const employeeRoute = require('./routes/Employee');

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('DB connection successfully'))
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/employees', employeeRoute);
app.use('/api/customers', customerRoute);
app.use('/api/heart_rate', heartRateRoute);
app.use('/api/hospital', hospitalRoute);
app.use('/api/message', messageRoute);
app.use('/public', express.static('public'));



const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    console.log('Received message:', message);
    io.emit('receive_message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log('Backend server running!');
});
