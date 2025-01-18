import { memoize } from './performance';
import benediktBonnmann from '../data/experts/benedikt-bonnmann.json';
import annaGraf from '../data/experts/anna-graf.json';
import dorotheeReki from '../data/experts/dorothee-t-reki.json';
import antonioKruger from '../data/experts/antonio-kr-ger.json';
import andreasDubler from '../data/experts/andreas-d-ubler.json';
import alexanderClaas from '../data/experts/alexander-claas.json';
import aidanGomez from '../data/experts/aidan-gomez.json';

// Static expert data
const EXPERTS = [
  benediktBonnmann,
  annaGraf,
  dorotheeReki,
  antonioKruger,
  andreasDubler,
  alexanderClaas,
  aidanGomez
];

// Memoize the fetch operation
const fetchExperts = memoize(async () => {
  try {
    return EXPERTS;
  } catch (error) {
    console.error('Error loading experts:', error);
    return [];
  }
});

// Chunk loading helper with error handling
export const loadExpertsInChunks = async (chunkSize = 10) => {
  try {
    const experts = await fetchExperts();
    const chunks = [];
    
    for (let i = 0; i < experts.length; i += chunkSize) {
      chunks.push(experts.slice(i, i + chunkSize));
    }
    
    return {
      initialChunk: chunks[0] || [],
      remainingChunks: chunks.slice(1),
      total: experts.length
    };
  } catch (error) {
    console.error('Error loading expert chunks:', error);
    return {
      initialChunk: [],
      remainingChunks: [],
      total: 0
    };
  }
};

// Progressive loading helper with error handling
export const loadMoreExperts = async (currentCount, limit = 10) => {
  try {
    const experts = await fetchExperts();
    return experts.slice(currentCount, currentCount + limit);
  } catch (error) {
    console.error('Error loading more experts:', error);
    return [];
  }
}; 