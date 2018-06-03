module.exports = function (io, dbClient) {

    io.on('connection',(client) =>{
        require('./socket-client')(client,dbClient);
    });
};


