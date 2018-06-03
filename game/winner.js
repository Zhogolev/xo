const positions = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['1', '4', '7'],
    ['2', '5', '8'],
    ['3', '6', '9'],
    ['1', '5', '9'],
    ['3', '5', '7']
];

module.exports =  function (steps, cb) {

    if (steps.length < 3)
      return cb(false);

    else {
        console.log("check for win");
        for (let i = 0; i < positions.length; i++){
            let line = positions[i];
            if (steps.includes(line[0]) &&
                steps.includes(line[1]) &&
                steps.includes(line[2])) {
                return cb(true);
            }
            if(i === positions.length - 1){
                console.log(false);
                cb(false);
            }
        }

    }
};