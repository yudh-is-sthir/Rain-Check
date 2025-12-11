require('dotenv').config();
const { Worker } = require('bullmq');

const API_KEY = process.env.OPENWEATHER_API_KEY;
const redisOptions = { connection: { host: 'redis', port: 6379 } };

console.log('👷 Worker Service Started... Waiting for jobs');

const worker = new Worker('weather-jobs', async job => {
  console.log(`🚀 Processing Job ${job.id}: ${job.data.cities.length} cities`);
  const { cities, userId } = job.data;

  const results = [];

  // Simulate processing each city
  for (const city of cities) {
    try {
      console.log(`   Fetching ${city}...`);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200) {
        results.push({ city: data.name, temp: data.main.temp });
      } else {
        console.error(`   Error fetching ${city}: ${data.message}`);
      }
    } catch (e) {
      console.error(`   Failed to fetch ${city}`);
    }

    // Artificial delay to simulate "heavy work"
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`✅ Job ${job.id} Complete! Processed ${results.length} cities.`);
  return results; // Result stored in Redis for retrieval
}, redisOptions);

worker.on('completed', job => {
  console.log(`🎉 Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`❌ Job ${job.id} has failed with ${err.message}`);
});
