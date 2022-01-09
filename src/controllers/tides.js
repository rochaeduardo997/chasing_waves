const { stablishConnection } = require('../db/index');

class Tides {
  async findTodayTide(req, res){
    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;

    try{
      const { full_registries, dates, suns, tides } = await stablishConnection();

      let [datesResult]             = await dates.read({ day, month });
      let [fullRegistriesResult]    = await full_registries.read({  'id': datesResult.fk_full_registry_id  });
      let [sunsResult]              = await suns.read({ 'fk_full_registry_id': datesResult.fk_full_registry_id });
      let [tidesResult]             = await tides.read({ 'fk_full_registry_id': datesResult.fk_full_registry_id });

      const result = {
        'id':     fullRegistriesResult.id,
        'source': fullRegistriesResult.source,
        'date':   `${datesResult.day}/${datesResult.month}/${datesResult.year}`,
        'sun': {
          'sunrise': sunsResult.sunrise,
          'sunset':  sunsResult.sunset
        },
        'tide': {
          'first_tide':  [ tidesResult.first_tide_hour, tidesResult.first_tide ],
          'second_tide': [ tidesResult.second_tide_hour, tidesResult.second_tide ],
          'third_tide':  [ tidesResult.third_tide_hour, tidesResult.third_tide ],
          'fourth_tide': [ tidesResult.fourth_tide_hour, tidesResult.fourth_tide ]
        }
      }
      
      datesResult          = null;
      fullRegistriesResult = null;
      sunsResult           = null;
      tidesResult          = null;

      emitter.emit('printlog', 'Tides controller', `{ 'status': true, id: ${ result.id } }`);
      
      return res.status(500).json({ 'status': true, result });
    }catch(err){
      emitter.emit('printlog', 'Tides controller', `{ 'status': false, 'msg': ${ err.message } }`);

      return res.status(500).json({ 'status': false, 'msg': err.message });
    }
  }
}

module.exports = new Tides();
