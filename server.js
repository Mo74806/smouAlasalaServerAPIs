const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// DB.connect(DB, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false
// });
mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch(e => console.log(e));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
