const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.post('/generate-jwt', (req, res) => {
  const { userId, sessionName, roleType } = req.body;
  const zoomAppKey = process.env.ZOOM_APP_KEY;
  const zoomAppSecret = process.env.ZOOM_APP_SECRET;

  const payload = {
    app_key: zoomAppKey,
    version: 1,
    user_identity: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (23 * 3600), // 23 hours from now
    tpc: sessionName,
    role_type: parseInt(roleType, 10),
    cloud_recording_option: 1,
  };

  jwt.sign(payload, zoomAppSecret, { algorithm: 'HS256' }, (err, token) => {
    if (err) {
      console.error('Error generating JWT:', err);
      res.status(500).json({ error: 'Failed to generate JWT' });
    } else {
      res.json({ token });
    }
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
