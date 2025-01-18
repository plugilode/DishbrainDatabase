const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const API_KEY = 'sk_4c1b9bca74ebab7ae6ae81e8e4fc4f9c71b8bf73';
const API_URL = 'https://api.scrapin.io/enrichment/profile';

async function enrichProfile(linkedInUrl) {
  try {
    console.log('Calling LinkedIn API for URL:', linkedInUrl);
    
    const response = await axios.get(API_URL, {
      params: {
        apikey: API_KEY,
        linkedInUrl: linkedInUrl
      },
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error enriching profile:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return null;
  }
}

async function updateExpertJson(expert, enrichedData) {
  if (!enrichedData) return expert;

  return {
    ...expert,
    personalInfo: {
      ...expert.personalInfo,
      title: enrichedData.title || expert.personalInfo.title,
      image: enrichedData.profilePicture || expert.personalInfo.image,
      location: enrichedData.location,
      languages: enrichedData.languages || expert.personalInfo.languages
    },
    currentRole: {
      ...expert.currentRole,
      title: enrichedData.currentRole?.title || expert.currentRole.title,
      organization: enrichedData.currentRole?.company || expert.currentRole.organization,
      description: enrichedData.currentRole?.description
    },
    experience: enrichedData.experience?.map(exp => ({
      title: exp.title,
      company: exp.company,
      duration: exp.duration,
      description: exp.description
    })),
    education: enrichedData.education?.map(edu => ({
      school: edu.school,
      degree: edu.degree,
      field: edu.field,
      duration: edu.duration
    })),
    skills: enrichedData.skills,
    connections: enrichedData.connections,
    lastUpdated: new Date().toISOString()
  };
} 