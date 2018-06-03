const isWinner = require('./winner');

module.exports = function (uSteps, aiSteps, cb) {

    isWinner(uSteps, (result) => {
        if (result) {
            return cb({
                "status": "end",
                "winner": "user"
            });

        }
        else if (uSteps.length + aiSteps.length === 9)
            return cb({
                "status": "end"
            });
        else
            getRandomStep(uSteps, aiSteps, (aiStep) => {
                aiSteps.push(aiStep);

                isWinner(aiSteps, (result) => {

                    if (result)
                        return cb({
                            "status": "end",
                            "winner": "ai",
                            "step": aiStep
                        });

                    else if (uSteps.length + aiSteps.length === 9)
                        return cb({
                            "status": "end"
                        });
                    else
                        return cb({
                            "status": "running",
                            "step": aiStep
                        });

                })


            });


    });
};

getRandomStep = function (uSteps, aiSteps, cb) {

    while (true) {
        let aiStep = '' + (Math.floor(Math.random() * (9)) + 1);

        if (!uSteps.includes(aiStep) && !aiSteps.includes(aiStep)) {
            return cb(aiStep);
        }

    }
};