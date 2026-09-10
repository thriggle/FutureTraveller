/**
 * FutureTraveller Unified Data Loader
 * Provides cached, asynchronous access to the single source of truth JSON datasets in /data.
 * Supports both Browser (fetch) and Node.js (fs) runtime environments.
 */

let cachedSkills = null;
let cachedCareers = null;
let cachedCitizenJobs = null;
let cachedSpeciesIndex = null;
const cachedSpecies = new Map();
let cachedStarshipDrives = null;
let cachedStarshipHulls = null;

// Resolve base data path dynamically relative to DataLoader.js location
const BASE_DATA_PATH = new URL('../../data/', import.meta.url).href;

/**
 * Fetch and parse a JSON file relative to data folder.
 * Seamlessly handles browser fetch and Node.js filesystem reads.
 */
async function fetchJson(relativePath) {
    if (typeof window === 'undefined' && typeof process !== 'undefined') {
        const fs = await import('fs/promises');
        const { fileURLToPath } = await import('url');
        const fileUrl = new URL(relativePath, BASE_DATA_PATH);
        const filePath = fileURLToPath(fileUrl);
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content);
    } else {
        const url = new URL(relativePath, BASE_DATA_PATH).href;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Failed to load dataset from ${url}: ${res.statusText}`);
        }
        return await res.json();
    }
}

/**
 * Load and cache skills dataset
 */
export async function loadSkills() {
    if (!cachedSkills) {
        cachedSkills = await fetchJson('skills.json');
    }
    return cachedSkills;
}

/**
 * Load and cache careers dataset
 */
export async function loadCareers() {
    if (!cachedCareers) {
        cachedCareers = await fetchJson('careers.json');
    }
    return cachedCareers;
}

/**
 * Load and cache 3D citizen jobs matrix
 */
export async function loadCitizenJobs() {
    if (!cachedCitizenJobs) {
        cachedCitizenJobs = await fetchJson('citizen_jobs.json');
    }
    return cachedCitizenJobs;
}

/**
 * Load species index registry
 */
export async function loadSpeciesIndex() {
    if (!cachedSpeciesIndex) {
        cachedSpeciesIndex = await fetchJson('species/index.json');
    }
    return cachedSpeciesIndex;
}

/**
 * Load a specific species profile (human, aslan, vargr, etc.)
 */
export async function loadSpecies(speciesId) {
    const key = speciesId.toLowerCase();
    if (!cachedSpecies.has(key)) {
        const data = await fetchJson(`species/${key}.json`);
        cachedSpecies.set(key, data);
    }
    return cachedSpecies.get(key);
}

/**
 * Load starship drive specifications
 */
export async function loadStarshipDrives() {
    if (!cachedStarshipDrives) {
        cachedStarshipDrives = await fetchJson('starships/drives.json');
    }
    return cachedStarshipDrives;
}

/**
 * Load starship hull specifications
 */
export async function loadStarshipHulls() {
    if (!cachedStarshipHulls) {
        cachedStarshipHulls = await fetchJson('starships/hulls.json');
    }
    return cachedStarshipHulls;
}

/**
 * Pre-cache all core datasets in parallel
 */
export async function preloadAllCoreData() {
    const [skills, careers, citizenJobs, speciesIndex, drives, hulls] = await Promise.all([
        loadSkills(),
        loadCareers(),
        loadCitizenJobs(),
        loadSpeciesIndex(),
        loadStarshipDrives(),
        loadStarshipHulls()
    ]);

    // Preload all species listed in the index
    await Promise.all(speciesIndex.map(s => loadSpecies(s.id)));

    return {
        skills,
        careers,
        citizenJobs,
        speciesIndex,
        drives,
        hulls
    };
}
