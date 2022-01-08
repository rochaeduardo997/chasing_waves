const EventEmitter = require('events');

const { printLog } = require('./utils');

const eventEmitter = new EventEmitter();

eventEmitter.on('printlog', (from, ...eventParams) => {
  printLog(from, ...eventParams);
});

global.emitter = eventEmitter;
