const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Require your routes here
 app.use('/videos', require('./routes/videos'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
