const fs = require('fs').promises;
const path = require('path');
const axios = require('axios'); // You'll need to install this: npm install axios

async function fetchExpertPhotos() {
  try {
    // Read all expert JSON files
    const expertsDir = path.join(process.cwd(), 'src/data/experts');
    const files = await fs.readdir(expertsDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    for (const file of jsonFiles) {
      const filePath = path.join(expertsDir, file);
      const content = await fs.readFile(filePath, 'utf8');
      const expert = JSON.parse(content);

      // Check if expert has a LinkedIn profile
      if (expert.profiles?.linkedin) {
        const expertId = expert.id;
        const linkedinUrl = expert.profiles.linkedin;
        
        console.log(`Processing ${expert.personalInfo.fullName}:`);
        console.log(`LinkedIn: ${linkedinUrl}`);
        
        // Create a directory for expert photos if it doesn't exist
        const photosDir = path.join(process.cwd(), 'public/experts');
        await fs.mkdir(photosDir, { recursive: true });

        // The photo filename will be based on the JSON filename
        const photoFilename = file.replace('.json', '.jpg');
        const photoPath = path.join(photosDir, photoFilename);

        // Update the expert's JSON with the photo path
        expert.personalInfo.image = `/experts/${photoFilename}`;
        
        // Write the updated JSON back to file
        await fs.writeFile(filePath, JSON.stringify(expert, null, 2));
        
        console.log(`Updated photo path for ${expert.personalInfo.fullName}`);
      }
    }

    console.log('Finished processing expert photos');
  } catch (error) {
    console.error('Error fetching expert photos:', error);
  }
}

fetchExpertPhotos(); 