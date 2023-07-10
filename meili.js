const { MeiliSearch } = require('meilisearch')
// const client = new MeiliSearch({ host: 'https://slimy-pumpkin-walrus-kwzk.sandbox.meilisearch.dev/', apiKey: "qXwBHSJcRjhZUQJuKvKzponfnuJLswTX" })
var dotenv = require('dotenv');
dotenv.config();
console.log("using host " , process.env.MEILI_SEARCH_HOST);
const client = new MeiliSearch({ host: process.env.MEILI_SEARCH_HOST, apiKey: process.env.MEILI_SEARCH_KEY });
// client.index('movie').delete().then(console.log);
// client.index('movies').delete().then(console.log);;
// client.index('assets').delete().then(console.log);;
// client.getStats().then(console.log);
client.createKey({
  description: 'Search key for trade dvchain UI',
  actions: ['search'],
  indexes: ['assets'],
  expiresAt: '2423-01-01T00:00:00Z'
}).then(console.log);