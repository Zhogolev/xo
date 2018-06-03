const gameServer = require('../game/game');

module.exports = function (client, dbClient) {

    const game = new gameServer(dbClient);


    client.on('data', (data) => {
        game.insertUserData(client, data)

    });

    client.on('newGame', (data) => {
        game.createGameForSocket(client, data);

    });

    client.on('endGame', () => {
        game.endGameForSocket(client);
    });

    client.on('getHistory', () => {
        dbClient.db('xo')
            .collection('historyXo')
            .find().forEach(row => {
            const steps = [];
            const firstPoint = row.playerTurn === 1 ? (row.playerPoint === 1 ? "X" : "0")
                : (row.playerPoint === 2 ? "X" : "0");

            const secondPoint = firstPoint === "X" ? "O" : "X";

            const first = row.playerTurn === 1 ? row.userStep : row.aiStep;
            const second = row.playerTurn === 2 ? row.userStep : row.aiStep

            for (let i = 0; i < first.length; i++) {
                steps[2 * i] = {"num": first[i], "point": firstPoint};
            }
            for (let i = 0; i < first.length; i++)
                steps[2 * i + 1] = {"num": second[i], "point": secondPoint};

            client.emit('history', {
                "winner": row.winner,
                "steps": steps,
                "id": row._id
            });
        });


    });

};