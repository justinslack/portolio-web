/**
 * Script to index Discogs collection into Algolia
 * Run with: npx tsx scripts/index-algolia.ts
 */

import { algoliasearch } from 'algoliasearch';
import { config } from 'dotenv';
import OAuth from 'oauth-1.0a';
import crypto_js from 'crypto-js';
import { resolve } from 'node:path';

// Load environment variables from .env or .env.local
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

// You'll need to set these in your .env or .env.local
const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
const ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY!;
const INDEX_NAME = 'discogs_collection';

const DISCOGS_TOKEN = process.env.DISCOGS_OAUTH_TOKEN!;
const DISCOGS_CONSUMER_KEY = process.env.DISCOGS_CONSUMER_KEY!;
const DISCOGS_CONSUMER_SECRET = process.env.DISCOGS_CONSUMER_SECRET!;
const DISCOGS_OAUTH_TOKEN_SECRET = process.env.DISCOGS_OAUTH_TOKEN_SECRET!;

function createOAuthHeader(url: string) {
  const oauth = new OAuth({
    consumer: {
      key: DISCOGS_CONSUMER_KEY,
      secret: DISCOGS_CONSUMER_SECRET
    },
    signature_method: 'HMAC-SHA1',
    hash_function(baseString: string, key: string) {
      return crypto_js.HmacSHA1(baseString, key).toString(crypto_js.enc.Base64);
    }
  });

  const token = {
    key: DISCOGS_TOKEN,
    secret: DISCOGS_OAUTH_TOKEN_SECRET
  };

  return oauth.toHeader(oauth.authorize({ url, method: 'GET' }, token));
}

interface DiscogsRelease {
  instance_id: number;
  id: number;
  date_added: string;
  uri?: string;
  basic_information: {
    id: number;
    title: string;
    year: number;
    cover_image: string;
    thumb: string;
    artists: Array<{ name: string }>;
    genres?: string[];
    styles?: string[];
    formats?: Array<{ name: string }>;
    labels?: Array<{ name: string }>;
  };
}

interface DiscogsPaginatedResponse {
  releases: DiscogsRelease[];
  pagination: {
    pages: number;
    page: number;
    per_page: number;
    items: number;
  };
}

async function fetchAllRecords() {
  console.log('🎵 Fetching all records from Discogs...');
  
  const allRecords: DiscogsRelease[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const url = `https://api.discogs.com/users/justinslack/collection/folders/0/releases?per_page=100&page=${page}&sort=artist`;
    
    const authHeader = createOAuthHeader(url);
    
    const response = await fetch(url, {
      headers: {
        ...authHeader,
        'User-Agent': 'DiscogsCollectionApp/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page ${page}: ${response.status}`);
    }

    const data = await response.json() as DiscogsPaginatedResponse;
    allRecords.push(...data.releases);
    
    totalPages = data.pagination.pages;
    console.log(`✓ Fetched page ${page}/${totalPages} (${allRecords.length} records so far)`);
    
    page++;
    
    // Rate limiting: wait 1 second between requests
    if (page <= totalPages) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } while (page <= totalPages);

  console.log(`\n✅ Fetched ${allRecords.length} total records\n`);
  return allRecords;
}

function transformRecordForAlgolia(record: DiscogsRelease) {
  const basic = record.basic_information;
  
  return {
    objectID: record.instance_id.toString(),
    instanceId: record.instance_id,
    releaseId: record.id,
    title: basic.title,
    artist: basic.artists[0]?.name || 'Unknown Artist',
    artists: basic.artists.map((a) => a.name),
    year: basic.year,
    genres: basic.genres || [],
    styles: basic.styles || [],
    coverImage: basic.cover_image,
    thumb: basic.thumb,
    formats: basic.formats?.map((f) => f.name) || [],
    labels: basic.labels?.map((l) => l.name) || [],
    uri: record.uri || `https://www.discogs.com/release/${basic.id}`,
    dateAdded: record.date_added,
    // For search ranking
    _searchableText: [
      basic.title,
      basic.artists[0]?.name,
      ...(basic.genres || []),
      ...(basic.styles || []),
      basic.year?.toString()
    ].filter(Boolean).join(' ')
  };
}

async function indexToAlgolia(records: DiscogsRelease[]) {
  console.log('🚀 Initializing Algolia client...');
  
  const client = algoliasearch(APP_ID, ADMIN_API_KEY);

  console.log('📝 Transforming records...');
  const algoliaRecords = records.map(transformRecordForAlgolia);

  console.log('⬆️  Uploading to Algolia...');
  
  // Upload in batches of 1000
  const batchSize = 1000;
  for (let i = 0; i < algoliaRecords.length; i += batchSize) {
    const batch = algoliaRecords.slice(i, i + batchSize);
    await client.saveObjects({
      indexName: INDEX_NAME,
      objects: batch
    });
    console.log(`✓ Uploaded batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(algoliaRecords.length / batchSize)}`);
  }

  console.log('\n🎨 Configuring search settings...');
  
  await client.setSettings({
    indexName: INDEX_NAME,
    indexSettings: {
      searchableAttributes: [
        'title',
        'artist',
        'artists',
        'styles',
        'genres',
        'labels'
      ],
      attributesForFaceting: [
        'searchable(artist)',
        'searchable(styles)',
        'searchable(genres)',
        'year',
        'formats'
      ],
      customRanking: ['desc(year)'],
      ranking: [
        'typo',
        'geo',
        'words',
        'filters',
        'proximity',
        'attribute',
        'exact',
        'custom'
      ]
    }
  });

  console.log('✅ Indexing complete!\n');
  console.log(`📊 Indexed ${algoliaRecords.length} records to Algolia index: ${INDEX_NAME}`);
}

async function main() {
  console.log('🎵 Discogs → Algolia Indexer\n');
  console.log('================================\n');

  // Debug: Check which env vars are loaded
  console.log('Environment check:');
  console.log(`- NEXT_PUBLIC_ALGOLIA_APP_ID: ${APP_ID ? '✓ Found' : '✗ Missing'}`);
  console.log(`- ALGOLIA_ADMIN_API_KEY: ${ADMIN_API_KEY ? '✓ Found' : '✗ Missing'}`);
  console.log(`- DISCOGS_OAUTH_TOKEN: ${DISCOGS_TOKEN ? '✓ Found' : '✗ Missing'}`);
  console.log(`- DISCOGS_CONSUMER_KEY: ${DISCOGS_CONSUMER_KEY ? '✓ Found' : '✗ Missing'}`);
  console.log();

  if (!APP_ID || !ADMIN_API_KEY) {
    console.error('❌ Missing Algolia credentials!');
    console.error('Please set NEXT_PUBLIC_ALGOLIA_APP_ID and ALGOLIA_ADMIN_API_KEY in your .env or .env.local');
    process.exit(1);
  }

  if (!DISCOGS_TOKEN || !DISCOGS_CONSUMER_KEY) {
    console.error('❌ Missing Discogs credentials!');
    console.error('Please set your Discogs OAuth credentials in .env or .env.local');
    process.exit(1);
  }

  try {
    const records = await fetchAllRecords();
    await indexToAlgolia(records);
    
    console.log('\n✨ All done! Your collection is now searchable on Algolia.\n');
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();

