let player_point = 1;
let player_turn = 1;
let myTurn = player_turn === 1;

const socket = io.connect(
    window.location.host
);

$(document).ready(() => {
    $("#desk").hide();

    $(".desk-item").mouseenter((elem) => {

    });

    $(".desk-item").mouseleave((elem) => {

    });

});

function startTheGame() {
    myTurn = player_turn === 1;
    $("#desk").show();
    $("#init").hide();

    socket.emit('newGame', {"playerPoint": player_point, "playerTurn": player_turn});
}


function selectPoint(num) {

    if (num != player_point) {
        $("#pointX, #pointO").toggleClass("active");
        player_point = num;
    }
}

function selectTurn(num) {

    if (num != player_turn) {
        $("#firstTurn, #secondTurn").toggleClass("active");
        player_turn = num;
    }
}

function endTheGame() {

    socket.emit('endGame');

    $("#desk > div > div").html("");

    $("#desk > div ").removeClass("busy");
    $("#desk > div ").addClass("free");

    $("#desk").hide();
    $("#init").show();
}

function selectItem(item) {
    if (!myTurn)
        return;

    myTurn = false;

    const text = player_point === 1 ? "X" : "0";


    if (!$(item).hasClass("busy")) {
        setItemBusy(item, text);
        socket.emit('data', item.toString().charAt(item.toString().length - 1));
    }
}

function setItemBusy(item, text) {
    $(item + " > div").html(text);
    $(item).toggleClass("free");
    $(item).toggleClass("busy");
}

socket.on('gemeCreated', (data) => {
    myTurn = data.playerTurn;
});

socket.on('game', (data) => {

        if (data.status === "end") {
            if (data.winner === "ai") {
                setItemBusy("#desk_item_" + data.step, player_point !== 1 ? "X" : "0");
            }
            alert("GAME FINISHED: WINNER " + data.winner);
        }
        else {
            setItemBusy("#desk_item_" + data.step, player_point !== 1 ? "X" : "0");
            myTurn = true;
        }
    }
);

socket.on('history', (data) => {
    $("#history").append("<div style='text-align: center;margin-top: 20px'>Game id " + data.id + "</div>");
    $("#history").append("<div style='text-align: center'>Winner " + data.winner + "</div>");

    $("#history").append("<div id=desk_" + data.id + " class='desk'>");

    for (let i = 1; i < 10; i++)
        $("#desk_"+data.id).append("<div id='hitem_" + i + "' class='desk-item' ></div>");

    for (let i= 1; i < data.steps.length + 1; i++) {
        $("#desk_" + data.id + " > #hitem_" + i).html("<p class='small'></p><div>" + data.steps[i - 1].point + "</div>");
        $("#desk_" + data.id + " > #hitem_" + i + " > p").html(i);

    }
});

function getHistory() {

    $("#history > div").remove();
    socket.emit('getHistory');
}