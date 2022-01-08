const axios   = require('axios');
const cheerio = require('cheerio');
const moment  = require('moment');

const url = 'https://www.apolo11.com/mare.php?local=20';

async function main(){
  try{
    const { data: resultTabuaDeMare } = await axios({ method: 'GET', url });
    const $                           = cheerio.load(resultTabuaDeMare);

    let result = new Array();

    $("#tab_mare").each((_, elem) => {
      try{
        let auxRow = new Array();
        $(elem).find('tr').each((_, elem) => {
          let row = $(elem).find('td').text();
          row     = JSON.stringify(row).split(' ');

          for(let i in row)                   row[i] = row[i].replace(/"|alta|baixa|\\n|\\t/gi, '').trim().replace('.', ',');
          for(let i in row) if(row[i] === '') row.splice(i, 1);
          for(let i in row) if(row[i] === '') row.splice(i, 1);

          let day     = row[0].replace(/^0/, '');
          let month   = parseInt(day.split('/')[1]);
          let year    = parseInt(day.split('/')[2]);
          let tide    = new Array();
          let sunrise = null;
          let sunset  = null;

          day = moment(day, 'D').format('D');

          if(!(/nascente|poente/gi).test(row[1])){
            row.splice(1, 1);
          }

          for(let i in row){
            if((/nascente/gi).test(row[i - 1])) sunrise = row[i];
            if((/poente/gi).test(row[i - 1]))   sunset = row[i];

            if(i > 4){
              tide.push(row[i].replace('h', ':'));
            }
          }

          let result = { year, month, day, tide, sunrise, sunset };

          auxRow.push(result);
        });

        result = auxRow;
      }catch(err){
        console.log(err);
      }
    });

    return result;
  }catch(err){
    throw new Error(`Failed on web scraping ${url}\n${err}`);
  }
}

module.exports = main();
