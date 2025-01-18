const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const API_KEY = 'sk_4c1b9bca74ebab7ae6ae81e8e4fc4f9c71b8bf73';
const API_URL = 'https://api.scrapin.io/enrichment/profile';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function enrichExpertProfile(linkedInUrl) {
  try {
    console.log('Enriching LinkedIn profile:', linkedInUrl);
    const response = await axios.get(API_URL, {
      params: {
        apikey: API_KEY,
        linkedInUrl
      },
      headers: {
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error enriching profile:', {
      url: linkedInUrl,
      message: error.message,
      status: error.response?.status
    });
    return null;
  }
}

async function updateExpertJson(expertFile, enrichedData) {
  if (!enrichedData) return false;

  try {
    const filePath = path.join(process.cwd(), 'src/data/experts', expertFile);
    const expert = JSON.parse(await fs.readFile(filePath, 'utf8'));

    // Keep the exact structure from the template
    const updatedExpert = {
      id: expert.id,
      personalInfo: {
        title: expert.personalInfo.title,
        firstName: expert.personalInfo.firstName,
        lastName: expert.personalInfo.lastName,
        fullName: expert.personalInfo.fullName,
        image: expert.personalInfo.image, // Preserve existing image path
        email: expert.personalInfo.email,
        phone: expert.personalInfo.phone,
        languages: expert.personalInfo.languages
      },
      institution: {
        name: expert.institution.name,
        position: expert.institution.position,
        department: expert.institution.department,
        website: expert.institution.website
      },
      expertise: {
        primary: expert.expertise.primary,
        secondary: expert.expertise.secondary,
        industries: expert.expertise.industries
      },
      academicMetrics: {
        publications: {
          total: expert.academicMetrics.publications.total,
          sources: {
            googleScholar: expert.academicMetrics.publications.sources.googleScholar,
            scopus: expert.academicMetrics.publications.sources.scopus
          }
        }
      },
      currentRole: {
        title: expert.currentRole.title,
        organization: expert.currentRole.organization,
        focus: expert.currentRole.focus
      },
      profiles: {
        linkedin: expert.profiles.linkedin,
        company: expert.profiles.company
      },
      tags: expert.tags,
      source: expert.source,
      experience: enrichedData.experience?.map(exp => ({
        title: exp.title || '',
        company: exp.company || '',
        location: exp.location || '',
        duration: exp.duration || '',
        description: exp.description || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || ''
      })) || [],
      education: enrichedData.education?.map(edu => ({
        school: edu.school || '',
        degree: edu.degree || '',
        field: edu.field || '',
        duration: edu.duration || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        description: edu.description || ''
      })) || [],
      skills: enrichedData.skills || [],
      lastEnriched: new Date().toISOString()
    };

    await fs.writeFile(filePath, JSON.stringify(updatedExpert, null, 2));
    return true;
  } catch (error) {
    console.error('Error updating expert JSON:', error);
    return false;
  }
}

async function bulkEnrichExperts() {
  try {
    console.log('\n=== Starting Bulk Expert Enrichment ===\n');

    const expertsDir = path.join(process.cwd(), 'src/data/experts');
    const files = await fs.readdir(expertsDir);
    const jsonFiles = files.filter(file => file.endsWith('.json') && file !== '.json');

    console.log(`Found ${jsonFiles.length} expert files to process\n`);

    let enriched = 0;
    let failed = 0;
    let skipped = 0;

    for (const file of jsonFiles) {
      const filePath = path.join(expertsDir, file);
      const expert = JSON.parse(await fs.readFile(filePath, 'utf8'));

      console.log(`Processing: ${expert.personalInfo.fullName}`);

      if (!expert.profiles?.linkedin) {
        console.log('× No LinkedIn URL found - skipping\n');
        skipped++;
        continue;
      }

      // Check if profile was enriched in the last 24 hours
      if (expert.lastEnriched) {
        const lastEnriched = new Date(expert.lastEnriched);
        const hoursSinceEnrichment = (Date.now() - lastEnriched.getTime()) / (1000 * 60 * 60);
        if (hoursSinceEnrichment < 24) {
          console.log('× Recently enriched - skipping\n');
          skipped++;
          continue;
        }
      }

      console.log('LinkedIn URL:', expert.profiles.linkedin);
      
      const enrichedData = await enrichExpertProfile(expert.profiles.linkedin);
      
      if (enrichedData && await updateExpertJson(file, enrichedData)) {
        console.log('✓ Successfully enriched and updated\n');
        enriched++;
      } else {
        console.log('× Failed to enrich profile\n');
        failed++;
      }

      // Wait 2 seconds between requests
      await sleep(2000);
    }

    console.log('=== Enrichment Complete ===');
    console.log(`Total files: ${jsonFiles.length}`);
    console.log(`Successfully enriched: ${enriched}`);
    console.log(`Failed: ${failed}`);
    console.log(`Skipped: ${skipped}`);

  } catch (error) {
    console.error('Error in bulk enrichment:', error);
  }
}

// Run the enrichment
bulkEnrichExperts(); 