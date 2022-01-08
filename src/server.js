const app = require("express")();

require('./services/emitter');

app.listen(3000, 'localhost', async(error) => {
  if(error){
    emitter.emit('printlog', 'Server', 'Failed on stablish server at http://localhost:3000');
    return;
  }

  await require('./webScraping/load');

  emitter.emit('printlog', 'Server', 'Running at http://localhost:3000');
});
