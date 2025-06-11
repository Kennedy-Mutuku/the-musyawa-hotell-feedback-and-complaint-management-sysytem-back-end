const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: String,
  message: String
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

mongoose.connect('mongodb://127.0.0.1:27017/feedbackSystem')
  .then(async () => {
    console.log('Connected to MongoDB');

    const testFeedback = new Feedback({ name: 'Test User', message: 'Hello World' });
    await testFeedback.save();
    console.log('Test feedback saved');

    mongoose.connection.close();
  })
  .catch(err => {
    console.error('MongoDB connection or save error:', err);
  });
