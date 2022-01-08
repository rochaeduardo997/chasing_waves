const axios   = require('axios');
const cheerio = require('cheerio');

const url = 'https://tabuademares.com/br/ceara/fortaleza';

function cleanReturnFromCherio(value){
  let newValue = new Array();
  
  for(let i in value){
    let aux = JSON.stringify(value[i]).replace(/\\t/g, '');

    if(!(aux.length === 2)) {
      newValue.push(aux.replace(/\"/g, '').trim());
    }
  }

  return newValue;
}
function separateHourAndMetersInFour(value){
  let rowAux           = new Array();
  let rowAux2          = new Array();
  let rowAuxTestIsTrue = false;

  for(let i = 0; i < value.length; i++){
    rowAux.push(value[i].replace(' m', 'm'));

    let rowAuxTest   = rowAux[4] > '17:45' && rowAux.length % 6 === 0;
    rowAuxTestIsTrue = rowAuxTestIsTrue && rowAux.length === 6 ? !rowAuxTestIsTrue : rowAuxTestIsTrue;

    if(((rowAux.length === 8 || ((i + 1) % 8 === 0 && (rowAux.length !== 2 && rowAux.length !== 4 && rowAux[4] > '17:45'))) && i !== 0 && !rowAuxTestIsTrue) || rowAuxTest){
      rowAuxTestIsTrue = rowAux.length === 6 ? true : false;
      rowAux2.push(rowAux);
      rowAux = [];
    }
  }

  return rowAux2;
}

async function main(){
  try{
    const { data: resultTabuaDeMare } = await axios({ method: 'GET', url });
    const $                           = cheerio.load(resultTabuaDeMare);

    let result = new Array();

    $("#tabla_mareas").each((_, elem) => {
      try{
        let day     = $(elem).find('div[class="tabla_mareas_dia_numero"]').text();
        let tides   = $(elem).find('td[class="tabla_mareas_marea tabla_mareas_marea_border_bottom"]').text();
        let sunrise = $(elem).find('div[class="tabla_mareas_salida_puesta_sol_salida"]').text();
        let sunset  = $(elem).find('div[class="tabla_mareas_salida_puesta_sol_puesta"]').text();

        day     = day.split('\n').splice('\t');
        day     = cleanReturnFromCherio(day);

        tides     = tides.split('\n').splice('\t');
        tides     = cleanReturnFromCherio(tides);
        tides     = separateHourAndMetersInFour(tides);

        sunrise = sunrise.split('\n').splice('\t');
        sunrise = cleanReturnFromCherio(sunrise);

        sunset  = sunset.split('\n').splice('\t');
        sunset  = cleanReturnFromCherio(sunset);

        for(let i in day){
          result.push({ 
            year:    (new Date().getFullYear()),
            month:   (new Date().getMonth() + 1),
            day:     day[i],
            tide:    tides[i],
            sunrise: sunrise[i],
            sunset:  sunset[i]
          });
        }

        return result;
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
