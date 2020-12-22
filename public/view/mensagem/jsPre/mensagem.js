var chatWriting = !1, chatIsWriting, chatData = {}, chatMessageNotReaded = !1;

function showWriting() {
    $("#digitando").html(chatData.nome + " esta digitando...");
    clearTimeout(chatWriting);
    chatWriting = setTimeout(function () {
        $("#digitando").html("");
    }, 2000);
}

async function sendMessage(mensagem, isFile) {
    if (typeof mensagem === "string" && mensagem.trim().length) {
        mensagem = mensagem.trim();

        /**
         * DOM control
         */
        $('<li class="skeletonmessage" rel="' + PARAM[0] + '"><p>' + mensagem + '<i class="material-icons h6 received mb-0 float-right pl-1" rel="0">done</i><small>' + moment().calendar() + '</small></p></li>').appendTo($('.messages ul'));
        $(".messages")[0].scrollTop = $(".messages")[0].scrollHeight;
        $("#message-text").val('');

        chatMessageNotReaded = !0;
        let r = await AJAX.post("sendMessage", {user: PARAM[0], mensagem: mensagem, isFile: (typeof isFile !== "undefined")});
        if(r == 2)
            toast("Você foi bloqueado", 1500, "toast-error");
    }
}

function controlMessages(data) {
    let haveLidoIgualAZero = !1;
    $("#digitando").html("");
    
    for(let m of data.mensagens) {
        m.data = moment(m.data).calendar();
        m.lido = parseInt(m.lido);
        m.isMe = m.usuario == USER.id;

        if(m.lido === 0) {
            chatMessageNotReaded = !0;
            haveLidoIgualAZero = !0;
        }

        if(m.isPendent)
            $('<li class="skeletonmessage" rel="' + USER.id + '"><p>' + m.mensagem + '<small>' + m.data + '</small></p></li>').appendTo($('.messages ul'));
    }

    if(!haveLidoIgualAZero && chatMessageNotReaded) {
        chatMessageNotReaded = !1;
        $(".received[rel='0']").attr("rel", 1).html("done_all");
    }

    if($(".messages").length)
        $(".messages")[0].scrollTop = $(".messages")[0].scrollHeight;

    chatData = data;
    return data;
}

$(async function () {
    /**
     * Receive writing information
     */
    sse.add("writing", function (data) {
        if ($("#blo").attr("rel") == 0) {
            if (!isEmpty(data) && !isEmpty(data[PARAM[0]]))
                showWriting();
        }
    });

    $("#app").off("click", ".submit").on("click", ".submit", function () {
        sendMessage($("#message-text").val());

    }).off("keyup", "#message-text").on("keyup", "#message-text", function (e) {
        if (e.keyCode === 13) {
            sendMessage($(this).val());
        } else {
            clearTimeout(chatIsWriting);
            chatIsWriting = setTimeout(function () {
                AJAX.get("chatIsWriting/" + PARAM[0]);
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
        chatData.silenciado = chatData.silenciado === 1 ? 0 : 1;
        db.exeUpdate("messages_user", {id: chatData.id, silenciado: chatData.silenciado});

        $("#silenciar > li").html(chatData.silenciado ? "Não silenciar" : "Silenciar");
        if (chatData.silenciado)
            $("#sil").removeClass("hide").attr("rel", 1);
        else
            $("#sil").addClass("hide").attr("rel", 0);

        $("#menu-chat").removeClass("active");
        $("body").off("mouseup");

    }).off("click", "#bloquear").on("click", "#bloquear", function () {
        chatData.bloqueado = chatData.bloqueado === 1 ? 0 : 1;
        db.exeUpdate("messages_user", {id: chatData.id, bloqueado: chatData.bloqueado});

        $("#bloquear > li").html(chatData.bloqueado ? "Desbloquear" : "Bloquear");
        if (chatData.bloqueado)
            $("#blo").removeClass("hide").attr("rel", 1);
        else
            $("#blo").addClass("hide").attr("rel", 0);

        $("#menu-chat").removeClass("active");
        $("body").off("mouseup");

    }).off("click", ".modal-open").on("click", ".modal-open", function () {
        _openPreviewFile($(this).data("url"), $(this).data("nome"), $(this).data("name"), $(this).data("type"), $(this).data("filetype"), $(this).find(".preview").html());

    }).off("change", "#anexo").on("change", "#anexo", async function (e) {

        /**
         * Send Anexo
         */
        let templates = await getTemplates();
        if (!chatData.bloqueado) {
            if (typeof e.target.files[0] !== "undefined") {
                let upload = await AJAX.uploadFile(e.target.files);

                /**
                 * Send message anexo
                 */
                for (let file of upload)
                    sendMessage(Mustache.render(templates.anexoCard, file), 1);
            }
        } else {
            toast("Você bloqueou este contato", 1500, "toast-warning");
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