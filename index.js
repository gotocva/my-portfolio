// index.js

const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const port = 8000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up a route to handle the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.all('/deploy', (req, res) => {

  res.json({status: true});
  
  const commands = [
    'git stash',
    'git pull',
    'npm install -f',
    'pm2 restart default-frontend'
  ]
  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
      }
  
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
  
      console.log(`stdout: ${stdout}`);
    });
  }

});

// Set up a route to handle 404 errors
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Default frontend Server is running on http://localhost:${port}`);
});
