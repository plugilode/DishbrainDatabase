const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

async function downloadImage(url, filepath) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer',
      timeout: 5000, // 5 second timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    await fs.writeFile(filepath, response.data);
    return true;
  } catch (error) {
    console.error('Error downloading image:', error.message);
    return false;
  }
}

async function getAllImageUrlsFromGoogle(expert) {
  try {
    const searchTerms = [
      expert.personalInfo.fullName,
      expert.institution.name,
    ].filter(Boolean).join(' ');

    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerms)}&tbm=isch`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    // Get all image URLs, including data URLs
    return $('img').map((i, el) => $(el).attr('src')).get();
  } catch (error) {
    console.error('Error fetching Google images:', error.message);
    return [];
  }
}

async function processExpertPhotos() {
  try {
    const expertsDir = path.join(process.cwd(), 'src/data/experts');
    const photosDir = path.join(process.cwd(), 'public/experts');
    
    await fs.mkdir(photosDir, { recursive: true });

    const files = await fs.readdir(expertsDir);
    const jsonFiles = files.filter(file => file.endsWith('.json') && file !== '.json');

    console.log('\n=== Automatic Expert Photo Processing Tool ===\n');

    for (const file of jsonFiles) {
      const filePath = path.join(expertsDir, file);
      const content = await fs.readFile(filePath, 'utf8');
      const expert = JSON.parse(content);
      
      const photoFilename = file.replace('.json', '.jpg');
      const photoPath = path.join(photosDir, photoFilename);

      console.log(`\n=== Processing: ${expert.personalInfo.fullName} ===`);

      // Check if photo already exists
      try {
        await fs.access(photoPath);
        console.log(`✓ Photo already exists: ${photoFilename}`);
        continue;
      } catch {
        console.log(`Searching photo for: ${expert.personalInfo.fullName}`);
      }

      // Get all image URLs
      console.log('Searching Google Images...');
      const imageUrls = await getAllImageUrlsFromGoogle(expert);
      
      if (imageUrls.length > 0) {
        console.log(`Found ${imageUrls.length} images, trying to download...`);
        
        // Try each URL until one works
        for (const url of imageUrls) {
          if (url && (url.startsWith('http') || url.startsWith('data:image'))) {
            console.log('Trying URL:', url.substring(0, 100) + '...');
            const success = await downloadImage(url, photoPath);
            
            if (success) {
              // Update the expert's JSON with the photo path
              expert.personalInfo.image = `/experts/${photoFilename}`;
              await fs.writeFile(filePath, JSON.stringify(expert, null, 2));
              console.log('✓ Successfully downloaded and saved photo');
              break; // Stop after first successful download
            }
          }
        }
      } else {
        console.log('× No images found');
      }
    }

    console.log('\n=== Processing Complete ===');
    console.log('\nExperts processed:');
    
    for (const file of jsonFiles) {
      const content = await fs.readFile(path.join(expertsDir, file), 'utf8');
      const expert = JSON.parse(content);
      const hasPhoto = expert.personalInfo.image && await fs.access(path.join(process.cwd(), 'public', expert.personalInfo.image)).then(() => true).catch(() => false);
      
      console.log(`\n${expert.personalInfo.fullName}:`);
      console.log(`- Photo: ${hasPhoto ? '✓' : '×'}`);
      if (expert.profiles.linkedin) console.log(`- LinkedIn: ${expert.profiles.linkedin}`);
      if (expert.profiles.company) console.log(`- Company: ${expert.profiles.company}`);
    }

  } catch (error) {
    console.error('Error processing expert photos:', error);
  }
}

processExpertPhotos(); 