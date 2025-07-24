const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

// Always resolve application.json relative to this file
const dataPath = path.join(__dirname, 'application.json');

// Middlewares
app.use(cors());
app.use(express.json());

// Helper: Read applications from file
function readApplications() {
  try {
    if (!fs.existsSync(dataPath)) {
      fs.writeFileSync(dataPath, JSON.stringify([]));
    }
    const data = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading application.json:', err);
    return [];
  }
}

// Helper: Write applications to file
function writeApplications(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// Routes

// GET all applications
app.get('/applications', (req, res) => {
  const applications = readApplications();
  res.json(applications);
});

// GET application by ID
app.get('/applications/:id', (req, res) => {
  const applications = readApplications();
  const application = applications.find(app => app.id === req.params.id);
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }
  res.json(application);
});

// POST new application
app.post('/applications', (req, res) => {
  const applications = readApplications();
  const newApp = {
    id: uuidv4(),
    ...req.body,
    updated_at: new Date().toISOString()
  };
  applications.push(newApp);
  writeApplications(applications);
  res.status(201).json(newApp);
});

// PUT update application by ID
app.put('/applications/:id', (req, res) => {
  const applications = readApplications();
  const index = applications.findIndex(app => app.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Application not found' });
  }

  applications[index] = {
    ...applications[index],
    ...req.body,
    updated_at: new Date().toISOString()
  };

  writeApplications(applications);
  res.json(applications[index]);
});

// DELETE application by ID
app.delete('/applications/:id', (req, res) => {
  const applications = readApplications();
  const filtered = applications.filter(app => app.id !== req.params.id);

  if (filtered.length === applications.length) {
    return res.status(404).json({ message: 'Application not found' });
  }

  writeApplications(filtered);
  res.json({ message: 'Application deleted successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
