const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

// Read the CSV file
const csvContent = fs.readFileSync(path.join(__dirname, '../../expert.csv'), 'utf-8');
const records = csv.parse(csvContent, {
  columns: true,
  skip_empty_lines: true
});

// Create experts directory if it doesn't exist
const expertsDir = path.join(__dirname, '../data/experts');
if (!fs.existsSync(expertsDir)) {
  fs.mkdirSync(expertsDir, { recursive: true });
}

// Track processed names to avoid duplicates
const processedNames = new Set();

// Helper functions
function extractTitle(name) {
  const titles = ['Prof. Dr.', 'Prof.', 'Dr.'];
  for (const title of titles) {
    if (name.startsWith(title)) return title;
  }
  return null;
}

function extractFirstName(name) {
  const nameParts = name.split(' ');
  // Remove titles
  while (nameParts[0] && (nameParts[0].includes('Prof') || nameParts[0].includes('Dr'))) {
    nameParts.shift();
  }
  return nameParts[0] || null;
}

function extractLastName(name) {
  const nameParts = name.split(' ');
  // Remove titles
  while (nameParts[0] && (nameParts[0].includes('Prof') || nameParts[0].includes('Dr'))) {
    nameParts.shift();
  }
  return nameParts[nameParts.length - 1] || null;
}

function generateImageName(name) {
  return `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;
}

function generateFilename(name) {
  return `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
}

function extractExpertise(art) {
  if (!art) return [];
  return art.split(',').map(item => item.trim());
}

function extractIndustries(art) {
  if (!art) return [];
  const industries = new Set();
  const artParts = art.split(',').map(item => item.trim().toLowerCase());
  
  // Map keywords to industries
  const industryMap = {
    'ki': 'AI',
    'künstliche intelligenz': 'AI',
    'tech': 'Technology',
    'medizin': 'Healthcare',
    'recht': 'Legal',
    'forschung': 'Research',
    'bildung': 'Education'
  };

  artParts.forEach(part => {
    for (const [keyword, industry] of Object.entries(industryMap)) {
      if (part.includes(keyword)) {
        industries.add(industry);
      }
    }
  });

  return Array.from(industries);
}

function extractTags(record) {
  const tags = new Set();
  
  // Add expertise areas
  if (record.Art) {
    record.Art.split(',').forEach(tag => tags.add(tag.trim()));
  }
  
  // Add role-based tags
  if (record.Job) {
    tags.add(record.Job.trim());
  }

  return Array.from(tags);
}

// Process each record
records.forEach((record) => {
  // Skip duplicate entries (same person, different rows)
  if (processedNames.has(record.Name)) return;
  processedNames.add(record.Name);

  const expertData = {
    id: `exp${record.Spalte1.padStart(3, '0')}`,
    personalInfo: {
      title: extractTitle(record.Name),
      firstName: extractFirstName(record.Name),
      lastName: extractLastName(record.Name),
      fullName: record.Name,
      image: `/experts/${generateImageName(record.Name)}`,
      email: record.Email || null,
      phone: record.Tel || null,
      languages: ["Deutsch", "Englisch"] // Default languages
    },
    institution: {
      name: record.Firma || null,
      position: record.Job || null,
      department: null,
      website: record.Link || null
    },
    expertise: {
      primary: extractExpertise(record.Art),
      secondary: [],
      industries: extractIndustries(record.Art)
    },
    academicMetrics: {
      publications: {
        total: null,
        sources: {
          googleScholar: null,
          scopus: null
        }
      }
    },
    currentRole: {
      title: record.Job || null,
      organization: record.Firma || null,
      focus: record.Art || null
    },
    profiles: {
      linkedin: record.Linkedin || null,
      company: record.Link || null
    },
    tags: extractTags(record),
    source: record.Quelle || null
  };

  // Generate filename
  const filename = generateFilename(record.Name);
  const filePath = path.join(expertsDir, filename);

  // Write JSON file
  fs.writeFileSync(filePath, JSON.stringify(expertData, null, 2));
  console.log(`Generated: ${filename}`);
});

console.log('\nDone! Generated expert JSON files.');
