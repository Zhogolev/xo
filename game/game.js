const ai = require('./ai-logic');
const games = [];

module.exports = function (dbClient) {

    if(dbClient === undefined){
        console.log("db client is undefined");
        return;

    }

    this.insertUserData = (client, userData) => {

        if (games[client.id]) {
            games[client.id].userStep.push(userData);

            ai(games[client.id].userStep, games[client.id].aiStep, (data) => {
                if (data.status === "end") {
                    games[client.id].winner = data.winner;
                    dbClient.db('xo')
                        .collection('historyXo')
                        .insertOne(games[client.id], (err, result) =>{
                            console.log(err);
                            console.log(result);
                        } );
                }

                client.emit('game', data)
            })
        }

    };

    this.createGameForSocket = (client, data) => {

        const steps = {
            "userStep": [],
            "aiStep": [],
            "playerTurn": data.playerTurn || 1,
            "playerPoint": data.playerPoint || 1
        };

        games[client.id] = steps;

        if(steps.playerTurn === 2){
            ai(games[client.id].userStep, games[client.id].aiStep, (data) => {
                client.emit('game', data)
            })
        }

    };

    this.endGameForSocket = (client) => {
        delete games[client.id];
    }

};