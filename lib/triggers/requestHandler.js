const log = require('../../helpers/logger');
const rabbitmq = require('../../helpers/rabbit');

const ERROR_PROPERTY = 'Error missing property';

module.exports.process = async function processTrigger(msg, cfg, snapshot = {}) {
	try {
		
		log.info("Inside mysqlConnector()");
        log.info("Msg=" + JSON.stringify(msg));
        log.info("Config=" + JSON.stringify(cfg));
        log.info("Snapshot=" + JSON.stringify(snapshot));
        
        let {data} = msg;
        
        if (!data) {
            this.emit('error', `${ERROR_PROPERTY} data`);
            throw new Error(`${ERROR_PROPERTY} data`);
        }
        
        snapshot.lastUpdated = snapshot.lastUpdated || new Date();
        
        if (Array.isArray(data)) {
			if (data.length > 0) {
				data.forEach(r => {
	                const emitData = {data: r};
	                log.info(emitData);
	                this.emit('data', emitData);
	            });
			}
		} else {
			log.info("data", data);
			this.emit('data', {data});
		}
        
        this.emit('snapshot', snapshot);
        log.info('Finished execution');
        this.emit('end');
        
	} catch (e) {
        log.error(`ERROR: ${e}`);
        this.emit('error', e);
        await rabbitmq.producerMessage(e);
    }
};