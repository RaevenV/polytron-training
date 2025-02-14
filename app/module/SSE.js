globalThis.SSEClients = [] //Global variable bisa dipanggil dimana pun
module.exports ={
    /**
     * Function to Initialize SSE (Server Sent Event)
     * @param {Object} request
     * @param {Object} response 
     */
    initSSE: async function (req,res){
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });
        
        const clientId = Date.now(); //id client bisa diubah sesuai kebutuhan

        const newClient = {
            id: clientId,
            res,
            page: '' //Page bisa diset untuk mengetahui client lagi dipage apa dan filtrasi client yang dikirim 
        }; //Setting page 

        SSEClients.push(newClient); //Clients list is global var, resetted when application is down
        
        req.on('close', () => { //SETTING ON CLOSE BISA DIUBAH SESUAI KEBUTUHAN
            console.log(`${clientId} Connection closed`);
            SSEClients = SSEClients.filter(SSEClients => SSEClients.id !== clientId);
        });
    },
    /**
     * Function to Send JSON.strinfied Events/Message to all Connected Client
     * @param {Object} data
     */
    sendEventsToAllClient: async function (data){
        SSEClients.forEach(SSEClients => SSEClients.res.write(`data: ${JSON.stringify(data)}\n\n`))
    },
    getCurrentConnectedClient: async function (){
        return SSEClients
    }
}

