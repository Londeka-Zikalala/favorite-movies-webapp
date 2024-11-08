import express from 'express';
import db from './db.js';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on PORT 3000`);
});
