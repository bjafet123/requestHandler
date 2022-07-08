require('dotenv').config();
const log = require('../helpers/logger');
const rabbitmq = require('../helpers/rabbit');
const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.post('/', async (req, res) => {
	try {
		
		log.info("Inside mysqlConnector()");
        log.info("Msg=" + JSON.stringify(req.body.data));
        log.info("Config=" + JSON.stringify(req.body.cfg));
        log.info("Snapshot=" + JSON.stringify(req.body.snapshot));
        
        const {data} = req.body;
        const {cfg} = req.body;
        
        if (!data) {
            res.status(401).json('Error missing data property');
            return;
        }
        if (!cfg) {
            res.status(401).json('Error missing cfg property');
            return;
        }
        
        if (Array.isArray(data)) {
			if (data.length > 0) {
				data.forEach(r => {
	                const emitData = {data: r};
	                log.info(emitData);
	            });
			}
		} else {
			log.info("data", data);
		}
        
        res.json({"respuesta":"true"});
        
	} catch (e) {
        log.error(`ERROR: ${e}`);
        await rabbitmq.producerMessage(e);
        res.status(500).json(e);
    }
});


app.listen(PORT, () => console.log('Service up in port', PORT));