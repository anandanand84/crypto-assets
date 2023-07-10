var Walk = require("@root/walk");
var path = require("path");
var fs = require("fs");
const { MeiliSearch } = require('meilisearch')
var hash = require('object-hash');
var dotenv = require('dotenv');
dotenv.config();
console.log("using host " , process.env.MEILI_SEARCH_HOST);
const client = new MeiliSearch({ host: process.env.MEILI_SEARCH_HOST, apiKey: process.env.MEILI_SEARCH_KEY });
client.index('movie').delete().then(console.log);
client.index('movies').delete().then(console.log);;
client.index('assets').updateSettings({
    searchableAttributes: [
        'id',
        'name',
        'symbol',
        'description',
        'tags',
        'status',
        'chain'
    ]
  });
client.index('assets')
.updateFilterableAttributes([
    'status',
    'tags',
    'erc20',
    'type',
    'chain'
])
// const client = new MeiliSearch({ host: 'https://slimy-pumpkin-walrus-kwzk.sandbox.meilisearch.dev/', apiKey: "qXwBHSJcRjhZUQJuKvKzponfnuJLswTX" })
function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    let data = Buffer.from(bitmap).toString('base64');
    return `data:image/png;base64,${data}`;
}


let count = 0;

Walk.walk("./assets/blockchains", walkFunc).then(function () {
  console.log("Done");
  console.log("Total assets: " + count);
});

// walkFunc must be async, or return a Promise
async function walkFunc(err, pathname, dirent) {
  if (err) {
    console.warn("fs stat error for %s: %s", pathname, err.message);
    return Promise.resolve();
  }

  if (dirent.isDirectory() && dirent.name.startsWith(".")) {
    return Promise.resolve(false);
  }

  if (dirent.name == "logo.png") {
    let info = pathname.toString().replace("logo.png", "info.json");
    let logo = pathname.toString()
    let chain = pathname.split('/')[2];
    let stats = fs.existsSync(info);
    if (stats) {
        let info_json = JSON.parse(fs.readFileSync(info).toString());
        info_json.erc20 = info_json.type === "ERC20";
        info_json.tags = info_json.tags || [];
        info_json.tags.push(info_json.type);
        info_json.chain = chain;
        info_json.tags.push(chain);
        info_json.id = info_json.id ? info_json.id : hash(info_json);
        let name = `${chain}_${info_json.symbol.split('/').join('_')}_${info_json.id}`;
        info_json.image = '/images/'+name+'.png';
        client.index('assets').addDocuments(info_json);
        
        fs.writeFileSync(`images/${name}.png`, fs.readFileSync(logo));
        fs.writeFileSync(`generated/${name}.json`, JSON.stringify(info_json, null, 2));
        count++;
    }
  }

  console.log("name:", dirent.name, "in", path.dirname(pathname));
  console.log("is file?", dirent.isFile());
  console.log("is link?", dirent.isSymbolicLink());
  console.log("processing ", count);
  await new Promise((resolve, reject)=> setTimeout(resolve, 200));
  return Promise.resolve();
}
