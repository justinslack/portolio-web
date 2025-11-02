/**
 * Sync Discogs Collection to Algolia
 * 
 * Run this script to index your entire Discogs collection in Algolia.
 * This enables fast, searchable access to all your records.
 * 
 * Usage: npx tsx scripts/sync-to-algolia.ts
 */

import { algoliasearch } from 'algoliasearch';
import { discogsAuthFetch } from '../app/lib/discogs-auth';
import type DiscogsResponse from '../app/types/DiscogsResponse';

const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_API_KEY;
const INDEX_NAME = 'discogs_collection';

interface AlgoliaRecord {
  objectID: string;
  instance_id: number;
  release_id: number;
  artist: string;
  title: string;
  year: number;
  label: string;
  catalog_number: string;
  cover_image: string;
  genres: string[];
  styles: string[];
  formats: string[];
  date_added: string;
  uri: string;
  folder_id?: number;
}

async function fetchAllRecords(folderId: number = 0): Promise<AlgoliaRecord[]> {
  const records: AlgoliaRecord[] = [];
  let page = 1;
  let hasMore = true;

  console.log(`📀 Fetching records from folder ${folderId}...`);

  while (hasMore) {
    try {
      const response = await discogsAuthFetch(
        `https://api.discogs.com/users/justinslack/collection/folders/${folderId}/releases?per_page=100&page=${page}&sort=artist`
      );

      if (!response.ok) {
        console.error(`Failed to fetch page ${page}`);
        break;
      }

      const data = (await response.json()) as DiscogsResponse;
      
      // Transform to Algolia format
      const algoliaRecords = data.releases.map(record => ({
        objectID: record.instance_id.toString(),
        instance_id: record.instance_id,
        release_id: record.basic_information.id,
        artist: record.basic_information.artists[0]?.name || 'Unknown Artist',
        title: record.basic_information.title,
        year: record.basic_information.year,
        label: record.basic_information.labels?.[0]?.name || '',
        catalog_number: record.basic_information.labels?.[0]?.catno || '',
        cover_image: record.basic_information.cover_image || '',
        genres: record.basic_information.genres || [],
        styles: record.basic_information.styles || [],
        formats: record.basic_information.formats?.map(f => f.name) || [],
        date_added: record.date_added,
        uri: record.uri || record.basic_information.uri || `https://www.discogs.com/release/${record.basic_information.id}`,
        folder_id: folderId
      }));

      records.push(...algoliaRecords);
      
      console.log(`✅ Fetched page ${page}/${data.pagination.pages} (${records.length} records so far)`);
      
      hasMore = page < data.pagination.pages;
      page++;

      // Rate limiting - be nice to Discogs API
      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      hasMore = false;
    }
  }

  return records;
}

async function syncToAlgolia() {
  console.log('🚀 Starting Algolia sync...\n');

  if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_KEY) {
    console.error('❌ Error: Algolia credentials not found in environment variables');
    console.error('Please set NEXT_PUBLIC_ALGOLIA_APP_ID and ALGOLIA_ADMIN_API_KEY');
    process.exit(1);
  }

  // Initialize Algolia client
  const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

  try {
    // Fetch all records from Discogs
    const records = await fetchAllRecords(0); // 0 = All folder
    
    console.log(`\n📊 Total records fetched: ${records.length}`);
    console.log('📤 Uploading to Algolia...\n');

    // Save to Algolia
    await client.saveObjects({
      indexName: INDEX_NAME,
      objects: records
    });

    console.log('✅ Successfully synced to Algolia!');
    console.log(`\n📈 Index: ${INDEX_NAME}`);
    console.log(`📝 Total records: ${records.length}`);
    
    // Configure index settings for better search
    console.log('\n⚙️  Configuring search settings...');
    
    await client.setSettings({
      indexName: INDEX_NAME,
      indexSettings: {
        searchableAttributes: [
          'artist',
          'title',
          'label',
          'styles',
          'genres',
          'catalog_number'
        ],
        attributesForFaceting: [
          'filterOnly(folder_id)',
          'searchable(styles)',
          'searchable(genres)',
          'year',
          'formats'
        ],
        customRanking: ['desc(date_added)', 'asc(artist)'],
        highlightPreTag: '<mark>',
        highlightPostTag: '</mark>',
      }
    });

    console.log('✅ Search settings configured!');
    console.log('\n🎉 All done! Your collection is now searchable.');
    
  } catch (error) {
    console.error('❌ Error syncing to Algolia:', error);
    process.exit(1);
  }
}

syncToAlgolia();

