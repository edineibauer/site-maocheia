if(typeof host === "undefined") {
    var host = HOME.replace("https://", "").replace("http://", "").split("/")[0];
    var socket = new WebSocket('ws://' + host + ':9999/mensagem/chat');

    // AJAX.get("serverMessage");
    var writing = !1, usuario = {};

    // Ao receber mensagens do servidor
    socket.addEventListener('message', function (event) {
        showMessage(JSON.parse(event.data));
    });
}

function showMessage(mensagem) {
    if ($.trim(mensagem.mensagem).length) {
        if(mensagem.mensagem === "...writing...") {
            if(mensagem.usuario != usuario.id)
                showWriting();
        } else {
            clearTimeout(writing);
            showLastOnline();
            $('<li class="' + (mensagem.usuario == usuario.id ? "replies" : "sent") + '"><p>' + mensagem.mensagem + '<small>' + (!isEmpty(mensagem.data) ? moment(mensagem.data) : moment()).format("HH:mm") + '</small></p></li>').appendTo($('.messages ul'));
            $('.message-input input').val(null);
            $(".messages").animate({scrollTop: $(".messages")[0].scrollHeight}, "fast");
        }
    }
}

function showWriting() {
    $("#perfil-status").html("digitando...");

    clearTimeout(writing);
    writing = setTimeout(function () {
        showLastOnline();
    },1500);
}

function showLastOnline(ultima_vez_online) {
    $("#perfil-status").html((!isEmpty(ultima_vez_online) ? moment(ultima_vez_online) : moment()).calendar());
}

function sendMessage() {
    const data = {
        usuario: usuario.id,
        mensagem: $("#message-text").val(),
        data: moment().format("YYYY-MM-DD HH:mm:ss")
    };

    socket.send(JSON.stringify(data));
    AJAX.post("serverSendMessage", data);
    $("#message-text").val('');
}

function sendWriting() {
    const data = {
        usuario: usuario.id,
        mensagem: "...writing...",
        data: moment().format("YYYY-MM-DD HH:mm:ss")
    };

    socket.send(JSON.stringify(data));
}

function updateDomInfo() {
    $("#perfil-image").attr("src", usuario.imagem);
    $("#perfil-name").html(usuario.nome);
    $("#perfil-link").attr("href", "cliente/" + usuario.id);
    showLastOnline();
}

(async () => {
    usuario = await db.exeRead("usuarios", history.state.param.url[0]);
    usuario.imagem = (!isEmpty(usuario.imagem) ? (usuario.imagem.constructor === Array && typeof usuario.imagem[0] !== "undefined" ? usuario.imagem[0].url : usuario.imagem ) : HOME + "assetsPublic/img/img.png");

    updateDomInfo();

    let read = new Read;
    read.setFilter({"usuario": usuario.id});
    let messageUser = await read.exeRead("messages_user");

    if(!isEmpty(messageUser) && messageUser.constructor === Array) {
        let mensagens = await db.exeRead("messages", messageUser[0].mensagem);
        $(".messages > ul").html("");
        if(!isEmpty(mensagens)) {
            for(m of mensagens.messages)
                showMessage(m);
        }
    }

    $("#message-text").off("keyup").on("keyup", function () {
        if (event.keyCode === 13)
            sendMessage();
        else
            sendWriting();
    });
    $('.submit').click(function () {
        sendMessage();
    });

    $(".social-media").off("click").on("click", function () {
        $("#menu-chat").toggleClass("active");
    });
})();