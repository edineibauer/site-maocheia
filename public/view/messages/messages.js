var chatWriting = !1;

async function filterMessages(data) {
    dados = [];
    if(!isEmpty(data)) {
        data = orderBy(data, 'data_ultima_mensagem').reverse();
        for (let d of data) {
            d.ultima_vez_online = moment(d.ultima_vez_online).calendar();
            dados.push(d);
        }
    }

    return data;
}

function readMessages(id) {
    let user = dados.find(e => e.usuario == id);
    pageTransition("message/" + id, "route", "forward", "#core-content", user);
}

var before = "";
function showWriting(data) {
    let user = Object.keys(data)[0];
    let $userChat = $(".message-card-message[rel='" + user + "']");
    if("digitando..." !== $userChat.html())
        before = $userChat.html();

    $(".message-card-message").html("digitando...");
    clearTimeout(chatWriting);
    chatWriting = setTimeout(function () {
        $userChat.html(before);
    }, 1500);
}

$(function () {
    AJAX.get("messages/receiveAll");

    /**
     * Receive writing information
     */
    let firstIgnore = !0;
    sseAdd("writing", function(data) {
        if(firstIgnore)
            firstIgnore = !1;
        else
            showWriting(data);
    });
})