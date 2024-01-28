require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoURI = process.env.MONGO_URI;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dns = require('dns');

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Basic Configuration
const port = process.env.PORT || 3000;

const urlSchema = new mongoose.Schema({
  originalUrl: {type: String, required: true, unique: true},
  shortUrl: {type: String, required: true, unique: true}
});

let urlModel = mongoose.model('url', urlSchema);

// Middleware
app.use('/', bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// root
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// short URL redirection endpoint
app.get('/api/shorturl/:shortUrl', async (req, res) => {
  try {
    let shortUrl = req.params.shortUrl;
    // Pause the execution until the Promise is resolved or rejected
    let foundUrl = await urlModel.findOne({ shortUrl: shortUrl });

    console.log(foundUrl);

    if (foundUrl) {
      let originalUrl = foundUrl.originalUrl;
      res.redirect(originalUrl);
    } else {
      res.json({ error: 'No short URL found for the given input' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// short url creation endpoint
app.post('/api/shorturl', (req, res) => {
  let url = req.body.url;
  try {
    // URL validation
    const urlObj = new URL(url);
    console.log(urlObj);
    dns.lookup(urlObj.hostname, async (err, address, family) => {
      if (!address) {
        res.json({ error: 'invalid address' });
      } else {
        try {
          const latestUrl = await urlModel.findOne({}).sort({ shortUrl: -1 }).limit(1);
          let shortUrl = 1;

          if (latestUrl) {
            shortUrl = parseInt(latestUrl.shortUrl) + 1;
          }

          const originalUrl = urlObj.href;
          const newUrl = new urlModel({ originalUrl, shortUrl });

          await newUrl.save();
          res.json({ original_url: originalUrl, short_url: shortUrl });
        } catch (error) {
          res.json({ error: 'Error while saving to the database' });
        }
      }
    });
  } catch {
    res.json({ error: 'invalid url' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
