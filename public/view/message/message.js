var chatWriting = !1, chatIsWriting;

function showWriting() {
    $("#perfil-status").html("digitando...");
    clearTimeout(chatWriting);
    chatWriting = setTimeout(function () {
        showLastOnline();
    }, 1500);
}

async function sendMessage(mensagem) {
    if (typeof mensagem === "string" && mensagem.trim().length) {
        if (typeof history.state.param.id !== "undefined") {
            if (!history.state.param.bloqueado) {
                let message = {
                    usuario: history.state.param.usuario,
                    mensagem: mensagem.trim(),
                    data: dateTimeFormat(),
                    lido: 0
                };

                history.state.param.relationData.mensagens.mensagens.push(message);
                history.replaceState(history.state, null, HOME + (HOME === "" && HOME !== SERVER ? "index.html?url=" : "") + app.route);

                AJAX.post("messages/sendMessage", {
                    id: history.state.param.relationData.mensagens.id,
                    mensagem: JSON.stringify(message),
                    usuario: history.state.param.usuario
                });

                /**
                 * DOM control
                 */
                $('<li class="skeletonmessage" rel="' + message.usuario + '"><p>' + mensagem + '<i class="material-icons h6 received mb-0 float-right pl-1" rel="0">done</i><small>' + moment().calendar() + '</small></p></li>').appendTo($('.messages ul'));
                $(".messages")[0].scrollTop = $(".messages")[0].scrollHeight;
                $("#message-text").val('');

            } else {
                toast("Usuário bloqueado", 1500, "toast-error");
            }
        } else {
            let message = {
                usuario: URL[0],
                mensagem: mensagem.trim(),
                data: dateTimeFormat(),
                lido: 0
            };
            let messages = [];
            messages.push(message)

            let responseMessages = await db.exeCreate("messages", {
                mensagens: messages
            });

            /**
             * DOM control
             */
            $('<li class="skeletonmessage" rel="' + URL[0] + '"><p>' + mensagem + '<i class="material-icons h6 received mb-0 float-right pl-1" rel="0">done</i><small>' + moment().calendar() + '</small></p></li>').appendTo($('.messages ul'));
            $(".messages")[0].scrollTop = $(".messages")[0].scrollHeight;
            $("#message-text").val('');

            if (responseMessages.response === 1) {
                await db.exeCreate("messages_user", {
                    mensagens: responseMessages.data.id,
                    usuario: URL[0],
                    ultima_vez_online: dateTimeFormat(),
                    data_ultima_mensagem: dateTimeFormat(),
                    ultima_mensagem: mensagem.trim(),
                });

                let messages = await db.exeRead("messages_user", {usuario: URL[0]});
                if (!isEmpty(messages)) {
                    messages[0].ultima_vez_online = moment(messages[0].ultima_vez_online).calendar();
                    history.state.param = messages[0];
                    history.replaceState(history.state, null, HOME + (HOME === "" && HOME !== SERVER ? "index.html?url=" : "") + app.route);
                    window.location.reload();
                }
            }
        }
    }
}

function showLastOnline() {
    $("#perfil-status").html((history.state.param.bloqueado ? "<i id='blo' class='material-icons blocked'>block</i>" : "") + (history.state.param.silenciado ? "<i id='sil' class='material-icons'>volume_off</i>" : "") + "<div class='lasto' id='lastonline'>online</div>");
}

function receiveNewMessages(messages) {
    let haveChanges = !1;
    let listIndices = [];
    if (typeof history.state.param.id !== "undefined") {

        /**
         * Get date from the last message received
         */
        let lastMessage = "";
        for (let um of history.state.param.relationData.mensagens.mensagens.reverse()) {
            if (um.usuario == USER.id) {
                lastMessage = um.data;
                break;
            }
        }

        /**
         * Revert the chat again to normal
         */
        history.state.param.relationData.mensagens.mensagens.reverse()

        for (let i in messages[0].mensagens) {
            let m = messages[0].mensagens[i];

            if (m.usuario == USER.id) {
                /**
                 * Message for me
                 */
                if (lastMessage === "" || m.data > lastMessage) {
                    haveChanges = !0;
                    m.lido = 1;
                    history.state.param.relationData.mensagens.mensagens.push(m);
                    listIndices.push(i);

                    /**
                     * DOM control
                     */
                    $('<li class="skeletonmessage" rel="' + m.usuario + '"><p>' + m.mensagem + (m.usuario == URL[0] ? '<i class="material-icons h6 received mb-0 float-right pl-1" rel="0">done</i>' : '') + '<small>' + moment(m.data).calendar() + '</small></p></li>').appendTo($('.messages ul'));
                    $(".messages")[0].scrollTop = $(".messages")[0].scrollHeight;
                }
            } else {
                /**
                 * Message send
                 * check if is readed
                 */
                if (m.lido == 1 && history.state.param.relationData.mensagens.mensagens[i].lido == 0) {
                    haveChanges = !0;
                    history.state.param.relationData.mensagens.mensagens[i].lido = 1;

                    /**
                     * DOM control
                     */
                    $(".received").attr("rel", 1).html("done_all");
                }
            }
        }

        if (haveChanges) {
            history.replaceState(history.state, null, HOME + (HOME === "" && HOME !== SERVER ? "index.html?url=" : "") + app.route);
            AJAX.post("messages/updateStatusMessage", {
                id: history.state.param.relationData.mensagens.id,
                indices: listIndices,
                usuario: URL[0]
            });
        }
    }
}

$(async function () {
    if (typeof history.state.param.id === "undefined") {
        $(".message-input").removeClass("hide");
        $(".message-input-buy").remove();

        if (!isNumberPositive(URL[0])) {
            toast("Usuário inválido", 2000, "toast-infor");
            history.back();
        }

        let messages = await db.exeRead("messages_user", {usuario: URL[0]});
        if (isEmpty(messages)) {
            /**
             * New chat message
             */
            let user = await db.exeRead("clientes", {usuarios_id: URL[0]});
            if (isEmpty(user)) {
                toast("Usuário não existe", 1500, "toast-warning");
                history.back();
            } else {
                /**
                 * First, set data on DOM
                 */
                user = user[0];
                $("#perfil-image").attr("src", (!isEmpty(user.perfil_profissional) ? user.perfil_profissional[0].imagem_de_perfil[0].urls.thumb : (!isEmpty(user.imagem) ? user.imagem[0].urls.thumb : (!isEmpty(user.imagem_url) ? user.imagem_url : HOME + "assetsPublic/img/img.png"))));
                $("#perfil-name").html(user.nome);
            }
        } else {
            messages[0].ultima_vez_online = moment(messages[0].ultima_vez_online).calendar();
            history.state.param = messages[0];
            history.replaceState(history.state, null, HOME + (HOME === "" && HOME !== SERVER ? "index.html?url=" : "") + app.route);
            window.location.reload();
        }
    } else {
        /**
         * Set messages as readed
         */
        AJAX.get("messages/readed/" + history.state.param.usuario);
        $(".datamessage").each(function (i, e) {
            $(e).html(moment($(e).html()).calendar());
        });
    }

    /**
     * Receive writing information
     */
    sseAdd("writing", function (data) {
        if (!isEmpty(data.writing)) {
            for (let id in data.writing) {
                if (id == URL[0] && (parseInt((parseInt(data.writing[id]) + 5).toString() + "000") > Date.now()))
                    showWriting();
            }
        }

        /**
         * Update last time online
         */
        if(!isEmpty(data.status)) {
            for(let id in data.status) {
                if (id == URL[0]) {
                    $("#lastonline").html(data.status[id]);
                    break;
                }
            }
        }
    });

    $("#app").off("click", ".submit").on("click", ".submit", function () {
        sendMessage($("#message-text").val());

    }).off("keyup", "#message-text").on("keyup", "#message-text", function () {
        if (event.keyCode === 13) {
            sendMessage($(this).val());
        } else {
            clearTimeout(chatIsWriting);
            chatIsWriting = setTimeout(function () {
                AJAX.get("messages/chatIsWriting/" + URL[0]);
            }, 400);
        }

    }).off("click", ".social-media").on("click", ".social-media", function () {
        let $menu = $("#menu-chat");
        if (!$menu.hasClass("active")) {
            $menu.addClass("active");
            $("body").off("mouseup").on("mouseup", function (e) {
                if (!$menu.is(e.target) && $menu.has(e.target).length === 0) {
                    setTimeout(function () {
                        $menu.removeClass("active");
                        $("body").off("mouseup");
                    }, 50);
                }
            })
        }

    }).off("click", "#silenciar").on("click", "#silenciar", function () {
        history.state.param.silenciado = history.state.param.silenciado == 1 ? 0 : 1;
        history.replaceState(history.state, null, HOME + (HOME === "" && HOME !== SERVER ? "index.html?url=" : "") + app.route);
        db.exeUpdate("messages_user", {id: history.state.param.id, silenciado: history.state.param.silenciado});

        $("#silenciar > li").html(history.state.param.silenciado ? "Não silenciar" : "Silenciar");
        if (history.state.param.silenciado)
            $("#sil").removeClass("hide");
        else
            $("#sil").addClass("hide");

        $("#menu-chat").removeClass("active");
        $("body").off("mouseup");

    }).off("click", "#bloquear").on("click", "#bloquear", function () {
        history.state.param.bloqueado = history.state.param.bloqueado == 1 ? 0 : 1;
        history.replaceState(history.state, null, HOME + (HOME === "" && HOME !== SERVER ? "index.html?url=" : "") + app.route);
        db.exeUpdate("messages_user", {id: history.state.param.id, bloqueado: history.state.param.bloqueado});

        $("#bloquear > li").html(history.state.param.bloqueado ? "Desbloquear" : "Bloquear");
        if (history.state.param.bloqueado)
            $("#blo").removeClass("hide");
        else
            $("#blo").addClass("hide");

        $("#menu-chat").removeClass("active");
        $("body").off("mouseup");

    }).off("click", ".modal-open").on("click", ".modal-open", function () {
        _openPreviewFile($(this).data("url"), $(this).data("nome"), $(this).data("name"), $(this).data("type"), $(this).data("filetype"), $(this).find(".preview").html());

    }).off("change", "#anexo").on("change", "#anexo", async function (e) {

        /**
         * Send Anexo
         */
        let templates = await getTemplates();
        if (!history.state.param.bloqueado) {
            if (typeof e.target.files[0] !== "undefined") {
                let upload = await AJAX.uploadFile(e.target.files);

                /**
                 * Send message anexo
                 */
                for (let file of upload)
                    sendMessage(Mustache.render(templates.anexoCard, file));
            }
        } else {
            toast("Usuário bloqueado", 1500, "toast-error");
        }
    });

    _resizeControl();
});

function closeModal() {
    $("#app").off("mouseup");
    $("#modalPreviewFile, #core-overlay").removeClass("active");
    $("#modalContent").html("");
}

function getContent(url, nome, type, fileType) {
    let $content = "";
    if (type === 1) {
        //imagem
        $content = "<img src='" + url + "' class='col' title='" + nome + "' alt='imagem para " + nome + "' />";
    } else if (type === 2) {
        //video
        $content = "<video height='700' controls><source src='" + url + "' type='" + fileType + "'></video>";
    } else if (type === 3) {
        //document
        $content = $("<iframe/>").attr("src", "https://docs.google.com/gview?embedded=true&url=" + url).attr("frameborder", "0").css({
            width: "100%",
            height: "99%",
            "min-height": (window.innerHeight - 200) + "px"
        });
    } else if (type === 4) {
        //audio
        $content = "<audio controls><source src='" + url + "' type='" + fileType + "'></audio>";
    }
    return $content;
}

function _resizeControl() {
    $("#modalPreviewFile").css("margin-left", ((window.innerWidth - $("#modalPreviewFile").width()) / 2) + "px");
    window.addEventListener("resize", function () {
        $("#modalPreviewFile").css("margin-left", ((window.innerWidth - $("#modalPreviewFile").width()) / 2) + "px");
    });
}

function _openPreviewFile(url, nome, name, type, fileType, preview) {
    /**
     * Overlay
     */
    $("#core-overlay").css("background-color", "rgba(0,0,0,.8)");
    $("#core-overlay, #modalPreviewFile").addClass("active");

    /**
     * Modal Content
     */
    $("#modalTitle").html((!/^image\//.test(fileType) ? preview : "") + nome);
    $("#modalContent").html(getContent(url, nome, type, fileType));
    $(".downloadModal").attr("href", url);
    if (type === 2)
        $("#modalContent video")[0].play();
    else if (type === 4)
        $("#modalContent audio")[0].play();

    /**
     * Close modal
     */
    $("#app").off("mouseup").on("mouseup", function (e) {
        if ($(".closeModal").is(e.target) || $(".closeModal > i").is(e.target) || $(".closeModal > #modalTitle").is(e.target) || $(".previewFileCard").is(e.target))
            closeModal();
    });
}