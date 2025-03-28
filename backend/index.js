const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/ai-tools', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  try {
    await mongoose.connection.db.dropCollection('ai-tools');
    console.log('Collection ai-tools dropped');
  } catch (e) {
    if (e.code === 26) {
      console.log('Collection ai-tools not found, skipping drop');
    } else {
      throw e;
    }
  }
})
.catch(err => console.error('MongoDB connection error:', err));

const aiToolSchema = new mongoose.Schema({
  name: String,
  description: String,
  link: String,
  category: String,
  department: String,
  use: String,
  details: String,
});

const AiTool = mongoose.model('AiTool', aiToolSchema);

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.get('/ai-tools', async (req, res) => {
  console.log('GET /ai-tools');
  try {
    const aiTools = await AiTool.find();
    console.log('AI Tools:', aiTools);
    res.json(aiTools);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/ai-tools', async (req, res) => {
  console.log('POST /ai-tools', req.body);
  try {
    const newAiTool = new AiTool({
      name: req.body.name,
      description: req.body.description,
      link: req.body.link,
      category: req.body.category,
      department: req.body.department,
      use: req.body.use,
      details: req.body.details,
    });
    await newAiTool.save();
    console.log('AI Tool created');
    res.status(201).send('AI Tool created');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.put('/ai-tools/:id', async (req, res) => {
  console.log('PUT /ai-tools/:id', req.params.id, req.body);
  try {
    const aiTool = await AiTool.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      link: req.body.link,
      category: req.body.category,
      department: req.body.department,
      use: req.body.use,
      details: req.body.details,
    }, { new: true });
    if (!aiTool) {
      return res.status(404).send('AI Tool not found');
    }
    console.log('AI Tool updated');
    res.send(aiTool);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.delete('/ai-tools/:id', async (req, res) => {
  console.log('DELETE /ai-tools/:id', req.params.id);
  try {
    const aiTool = await AiTool.findByIdAndDelete(req.params.id);
    if (!aiTool) {
      return res.status(404).send('AI Tool not found');
    }
    console.log('AI Tool deleted');
    console.clear();
    res.send('AI Tool deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.get('/ai-tools/:id', async (req, res) => {
  console.log('GET /ai-tools/:id', req.params.id);
  try {
    const aiTool = await AiTool.findById(req.params.id);
    if (!aiTool) {
      return res.status(404).send('AI Tool not found');
    }
    console.log('AI Tool found:', {
      name: aiTool.name,
      description: aiTool.description,
      link: aiTool.link,
      category: aiTool.category,
      department: aiTool.department,
      use: aiTool.use,
      details: aiTool.details,
    });
    res.json(aiTool);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/data', (req, res) => {
  console.log(req.body);
  res.send('Data received!');
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
