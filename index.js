// index.js

const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const port = 8000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up a route to handle the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.all('/deploy', (req, res) => {

  try {
    exec('git stash', (error, stdout, stderr) => {
      console.error(`Error: ${error}`, `stderr: ${stderr}`, `stdout: ${stdout}`);
      exec('git pull', (error, stdout, stderr) => {
        console.error(`Error: ${error}`, `stderr: ${stderr}`, `stdout: ${stdout}`);
        exec('npm install -f', (error, stdout, stderr) => {
          console.error(`Error: ${error}`, `stderr: ${stderr}`, `stdout: ${stdout}`);
          exec('pm2 restart default-frontend', (error, stdout, stderr) => {
            console.error(`Error: ${error}`, `stderr: ${stderr}`, `stdout: ${stdout}`);
          });
        });
      });
    });
    res.json({status: true});
  } catch (error) {
    res.json({status: true});
  }

});

// Set up a route to handle 404 errors
app.use((req, res) => {
  const filePath = path.join(__dirname, 'public', req.path+'.html');
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(200).sendFile(path.join(__dirname, 'public', '404.html'));
    } else {
      res.status(200).sendFile(path.join(__dirname, 'public', req.path+'.html'));
    }
  });
    
});

// Start the server
app.listen(port, () => {
  console.log(`Default frontend Server is running on http://localhost:${port}`);
});
