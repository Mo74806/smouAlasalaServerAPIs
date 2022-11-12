const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const AppError = require('./utils/appError');
const RouteErrorHandling = require('./controllers/errorController');

const userRouter = require('./routes/userRoutes');
const projectRouter = require('./routes/projectRoutes');
const appointementRouter = require('./routes/appointementRoutes');
const contactRouter = require('./routes/contactRoutes');

const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cros = require('cors');
const app = express();
app.options('*', cros()); // include before other routes
var path = require('path');

app.use(express.static(path.resolve('./public')));
app.use(cros());
// 1) MIDDLEWARES
app.use(helmet());
let limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many Requests from that IP'
});

// app.use('/api', limiter);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.use(mongoSanitize());
// app.use(xss());

// 2) ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/appointements', appointementRouter);
app.use('/api/v1/contacts', contactRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`coldn\'t make request to this url ${req.url} `, 404));
});

app.use(RouteErrorHandling);

module.exports = app;
