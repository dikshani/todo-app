const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/todolist';

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Successfully connected to MongoDB!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.model('Task', taskSchema);

// GET Tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    return res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST Task (Accepts title, task, text, or body string)
app.post('/api/tasks', async (req, res) => {
  try {
    console.log('Received Body:', req.body); // Log exact payload

    // Fallback: Check if user sent 'title', 'task', or 'text'
    const taskTitle = req.body.title || req.body.task || req.body.text || (typeof req.body === 'string' ? req.body : null);

    if (!taskTitle) {
      console.error('❌ Validation Failed: No task content provided in req.body');
      return res.status(400).json({ error: 'Task title is required' });
    }

    const newTask = new Task({ title: taskTitle });
    await newTask.save();
    console.log('✅ Task saved:', taskTitle);

    return res.status(200).json({ success: true, task: newTask });
  } catch (err) {
    console.error('❌ Error saving task:', err);
    return res.status(500).json({ error: err.message });
  }
});

// DELETE Task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Fallback Middleware
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  next();
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
