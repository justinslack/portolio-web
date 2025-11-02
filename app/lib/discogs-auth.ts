import OAuth from 'oauth-1.0a';
import crypto from 'crypto-js';

const oauth = new OAuth({
  consumer: {
    key: process.env.DISCOGS_CONSUMER_KEY || '',
    secret: process.env.DISCOGS_CONSUMER_SECRET || ''
  },
  signature_method: 'HMAC-SHA1',
  hash_function(baseString, key) {
    return crypto.HmacSHA1(baseString, key).toString(crypto.enc.Base64);
  }
});

const token = {
  key: process.env.DISCOGS_OAUTH_TOKEN || '',
  secret: process.env.DISCOGS_OAUTH_TOKEN_SECRET || ''
};

export async function discogsAuthFetch(url: string, options: RequestInit = {}) {
  const authHeader = oauth.toHeader(oauth.authorize({
    url,
    method: options.method || 'GET'
  }, token));

  const headers = {
    ...authHeader,
    'User-Agent': 'DiscogsCollectionApp/1.0',
    'Content-Type': 'application/json',
    ...options.headers
  };

  return fetch(url, {
    ...options,
    headers
  });
}

