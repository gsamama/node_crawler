const cheerio = require("cheerio");
const axios = require("axios");

const address = process.argv[2]; 
const depth = process.argv[3];

let results = [];

const loader = async (paramUrl, paramDepth=0) => {
  
  await axios({method: 'get', url: paramUrl}).then(output=>{

    const html = output.data; 
    const $ = cheerio.load(html);
  
    $('img', html).each(function(){

      const imageUrl = $(this).attr("src");
      const sourceUrl = paramUrl;
      const depth = paramDepth;
    
      results.push({imageUrl, sourceUrl, depth});
    
    });

    $('a', html).each(function(){
      if(isObjectUrl($(this))){
        
        const protocol = output.request.protocol;
        const host = output.request.host;
        const url = ($(this).attr('href').startsWith('http'))? $(this).attr('href') : protocol + "//" + host + $(this).attr('href');
        console.log(url)
        if(depth>0){
        
          const nextStepDepth = depth - 1;
          loader(url, nextStepDepth);
        
        }
      }
    });   
  }).catch()
  console.log(results);
}

const isObjectUrl = (objAddress) => (objAddress.attr('href')!==undefined)?true:false;

loader(address, depth);
