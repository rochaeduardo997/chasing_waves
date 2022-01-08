const { stablishConnection, stablishTransaction } = require('../db/index');

const createItem = async (model, data, transaction) => {
  try{
    const result = await model.create(data, transaction);

    return result;
  }catch(err){
    console.log('Insert into table failed', { 'status': false, 'msg': err.message });
  }
}

async function load() {
  const { full_registries, dates, suns, tides } = await stablishConnection();
  const transaction                             = await stablishTransaction();

  
  // let resultApolo11     = await require('./sites/apolo11');
  let resultTabuaDeMare = await require('./sites/tabuaDeMare');
  
  emitter.emit('printlog', 'Load tides', 'Preparing to load tides in database');
  try{
    const allDatesResult = await dates.read();

    for(let index in allDatesResult){
      let { day: dbDay, month: dbMonth, year: dbYear } = allDatesResult[index];
      let { day, month, year }                         = resultTabuaDeMare[index];

      day = parseInt(day);

      if(dbDay === day && dbMonth === month && dbYear === year) throw new Error('Tides already created in database on this month');
    }

    emitter.emit('printlog', 'Load tides', 'Loading tides');
    
    for(let index in resultTabuaDeMare){
      const { id: fk_full_registry_id } = await createItem(full_registries, { 'status': true, 'source': 'TabuaDeMare' }, transaction);

      await createItem(dates, {
        'year':  parseInt(resultTabuaDeMare[index].year), 
        'month': parseInt(resultTabuaDeMare[index].month), 
        'day':   parseInt(resultTabuaDeMare[index].day),
  
        fk_full_registry_id },
        transaction
      );

      await createItem(suns, {
        'sunrise': resultTabuaDeMare[index].sunrise, 
        'sunset':  resultTabuaDeMare[index].sunset,
  
        fk_full_registry_id
      },
        transaction
      );

      await createItem(tides, {
        'first_tide_hour': resultTabuaDeMare[index].tide[0],
        'first_tide':      resultTabuaDeMare[index].tide[1],
  
        'second_tide_hour':resultTabuaDeMare[index].tide[2],
        'second_tide':     resultTabuaDeMare[index].tide[3],
  
        'third_tide_hour': resultTabuaDeMare[index].tide[4],
        'third_tide':      resultTabuaDeMare[index].tide[5],
  
        'fourth_tide_hour':resultTabuaDeMare[index].tide[6],
        'fourth_tide':     resultTabuaDeMare[index].tide[7],
  
        fk_full_registry_id },
        transaction
      );
    }

    emitter.emit('printlog', 'Load tides', 'All tides has been load');

    await transaction.commit();
  
    return;
  }catch(err){
    await transaction.rollback();

    emitter.emit('printlog', 'Load tides', err.message);

    return false;
  }
};

module.exports = load();
