var chatWriting = {}, before = {};

async function filterMessages(data) {
    dados = [];
    if (!isEmpty(data)) {
        data = orderBy(data, 'data_ultima_mensagem');
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

function showWriting(data) {
    if (!isEmpty(data.writing)) {
        for (let user in data.writing) {

            /**
             * Check if the writing time is now
             */
            if ($("#blo-" + user).attr("rel") == 0 && (parseInt((parseInt(data.writing[user]) + 5).toString() + "000") > Date.now())) {
                let $userChat = $(".message-card-message[rel='" + user + "']");

                if ("digitando..." !== $userChat.text().trim())
                    before[user] = $userChat.html();

                $userChat.html("<div style='color: seagreen'>digitando...</div>");
                clearTimeout(chatWriting[user]);
                chatWriting[user] = setTimeout(function () {
                    $userChat.html(before[user]);
                }, 1500);
            }
        }
    }

    /**
     * Update last time online
     */
    if(!isEmpty(data.status)) {
        for(let i in data.status) {
            if($("#blo-" + i).attr("rel") == 0)
                $("#lastonline-" + i).html(data.status[i]);
        }
    }
}

$(function () {
    AJAX.get("messages/receiveAll");

    /**
     * Receive writing information
     */
    sseAdd("writing", showWriting);
})