const host = HOME.replace("https://", "").replace("http://", "").split("/")[0];
const socket = new WebSocket('ws://' + host + ':9999/mensagem/chat');
// AJAX.get("serverMessage");
var user = {};

// Ao receber mensagens do servidor
socket.addEventListener('message', function (event) {
    showMessage(JSON.parse(event.data));
});

function showMessage(mensagem) {
    if ($.trim(mensagem.mensagem).length) {
        $('<li class="' + (mensagem.usuario == USER.id ? "replies" : "sent") + '"><p>' + mensagem.mensagem + '<small>' + (!isEmpty(mensagem.data) ? moment(mensagem.data) : moment()).format("HH:mm") + '</small></p></li>').appendTo($('.messages ul'));
        $('.message-input input').val(null);
    }
}

function sendMessage() {
    const data = {
        usuario: user.id,
        mensagem: $("#message-text").val(),
        data: moment().format("YYYY-MM-DD HH:mm:ss")
    };

    socket.send(JSON.stringify(data));
    AJAX.post("serverSendMessage", data);
    $("#message-text").val('');
}

(async () => {
    user = await db.exeRead("usuarios", history.state.param.url[0]);

    let read = new Read();
    read.setFilter({"usuario": user.id});
    var userMessage = await read.exeRead("messages_user");

    if(!isEmpty(userMessage) && userMessage.constructor === Array) {
        let mensagens = await db.exeRead("messages", userMessage[0].mensagem);
        if(!isEmpty(mensagens)) {
            for(m of mensagens.messages)
                showMessage(m);
        }
    }

    $("#message-text").off("keyup").on("keyup", function () {
        if (event.keyCode === 13)
            sendMessage();
    });
    $('.submit').click(function () {
        sendMessage();
    });
})();