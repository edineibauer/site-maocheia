var mensagem = [];

$("#profile-img").click(function () {
    $("#status-options").toggleClass("active");
});

$(".expand-button").click(function () {
    $("#profile").toggleClass("expanded");
    $("#contacts").toggleClass("expanded");
});

$("#status-options ul li").click(function () {
    $("#profile-img").removeClass();
    $("#status-online").removeClass("active");
    $("#status-away").removeClass("active");
    $("#status-busy").removeClass("active");
    $("#status-offline").removeClass("active");
    $(this).addClass("active");

    if ($("#status-online").hasClass("active")) {
        $("#profile-img").addClass("online");
    } else if ($("#status-away").hasClass("active")) {
        $("#profile-img").addClass("away");
    } else if ($("#status-busy").hasClass("active")) {
        $("#profile-img").addClass("busy");
    } else if ($("#status-offline").hasClass("active")) {
        $("#profile-img").addClass("offline");
    } else {
        $("#profile-img").removeClass();
    }

    $("#status-options").removeClass("active");
});

function updateMessagesLoop() {
    clearInterval(updateMessageLoop);
    updateMessageLoop = null;
    updateMessageLoop = setInterval(function () {
        updateMessage();
    }, 2000);
}

function newMessage(content, sendByClient) {
    if ($.trim(content).length) {
        if(isEmpty(mensagem)) {
            let profissional = (USER.setor === "clientes" ? contato.id : USER.setorData.id);
            let cliente = (USER.setor === "clientes" ? USER.setorData.id : contato.id);
            mensagem = {
                profissional: profissional,
                cliente: cliente,
                aceitou: 0,
                pendente: 1,
                mensagens: []
            };
        }

        mensagem.mensagens.push({
            mensagem: loadMessage(content, sendByClient),
            enviada_pelo_cliente: USER.setor === "clientes" ? "1" : "0",
            data: moment().format("YYYY-MM-DD HH:mm:ss"),
            id: Date.now() + Math.floor((Math.random() * 1000) + 1),
            columnTituloExtend: '<small class="color-gray left opacity padding-tiny radius">mensagem</small><span style="padding: 1px 5px" class="left padding-right font-medium td-textarea">' + content + '</span>',
            columnName: "mensagens",
            columnRelation: "mensagem",
            columnStatus: {column: "", have: false, value: false}
        });

        $(".messages").animate({scrollTop: $(".messages")[0].scrollHeight}, "fast");

        console.log(Object.assign({}, mensagem));
        clearInterval(updateMessageLoop);
        db.exeCreate("mensagens", mensagem).then(() => {
            //ativa novamente o update das mensagens
            updateMessagesLoop();
        });
    }
}

function loadMessage(content, sendByClient) {
    if ($.trim(content).length) {
        let type = (sendByClient && USER.setor === "clientes") || (!sendByClient && USER.setor === "profissional") ? "replies" : "sent";
        $('<li class="' + type + '"><p>' + content + '<small>' + moment().format("HH:mm") + '</small></p></li>').appendTo($('.messages ul'));
        $('.message-input input').val(null);
    }

    return content;
}

function sendMessage() {
    newMessage($(".message-input input").val(), USER.setor === "clientes");
    $("#message-text").focus();
}

$('.submit').click(function () {
    sendMessage();
});

function updateMessage() {
    dbRemote.syncDownload("mensagens").then(result => {
        if (result !== 0) {
            if (messageId) {
                readMessage();
            } else {
                readAllMessages();
            }
        }
    });
}

function readMessage() {
    if (USER.setor === "clientes") {

        if (isEmpty(contato)) {
            /**
             * Lê o profissional
             */
            db.exeRead("profissional", messageId).then(perfil => {
                contato = perfil;
                contato.imagemPerfil = perfil.imagem_de_perfil !== null && typeof perfil.imagem_de_perfil !== "undefined" ? perfil.imagem_de_perfil[0].urls['100'] : HOME + VENDOR + "site-maocheia/public/assets/svg/account.svg";
                $("#perfil-info").html('<img src="' + contato.imagemPerfil + '" alt=""/><p>' + contato.nome + '</p>');
                $(".message-input").css("display", "block");

                /**
                 * Lê as mensagens do cliente com este profissional
                 */

                db.exeRead("mensagens").then(m => {
                    for (let i in m) {
                        if (parseInt(m[i].profissional) === contato.id) {
                            mensagem = m[i];
                            $('.messages ul').html("");
                            $(".message-input").css("display", "block");

                            for (let i in mensagem.mensagens)
                                loadMessage(mensagem.mensagens[i].mensagem, mensagem.mensagens[i].enviada_pelo_cliente === "1");

                            lastMessageData = mensagem.mensagens[mensagem.mensagens.length - 1].data;
                            $(".messages").animate({scrollTop: $(".messages")[0].scrollHeight}, 0);

                            break;
                        }
                    }
                })
            });
        } else {
            /**
             * Lê as mensagens do profissional com este cliente
             */
            clearInterval(updateMessageLoop);
            db.exeRead("mensagens", mensagem.id).then(m => {
                mensagem = m;

                console.log(mensagem.mensagens);
                for (let i in mensagem.mensagens) {
                    if (mensagem.mensagens[i].data > lastMessageData && ((USER.setor === "clientes" && mensagem.mensagens[i].enviada_pelo_cliente === "0") || (USER.setor === "profissional" && mensagem.mensagens[i].enviada_pelo_cliente === "1")))
                        loadMessage(mensagem.mensagens[i].mensagem, mensagem.mensagens[i].enviada_pelo_cliente === "1");
                }

                lastMessageData = mensagem.mensagens[mensagem.mensagens.length - 1].data;
                $(".messages").animate({scrollTop: $(".messages")[0].scrollHeight}, "fast");
                updateMessagesLoop();
            })
        }

    } else if (USER.setor === "profissional") {
        if (isEmpty(contato)) {

            /**
             * Lê o cliente
             */
            db.exeRead("clientes", messageId).then(perfil => {
                contato = perfil;
                contato.imagemPerfil = perfil.imagem !== null && typeof perfil.imagem !== "undefined" ? perfil.imagem[0].urls['100'] : HOME + VENDOR + "site-maocheia/public/assets/svg/account.svg";
                $("#perfil-info").html('<img src="' + contato.imagemPerfil + '" alt=""/><p>' + contato.nome + '</p>');

                /**
                 * Lê as mensagens do profissional com este cliente
                 */
                db.exeRead("mensagens").then(m => {
                    for (let i in m) {
                        if (parseInt(m[i].cliente) === contato.id) {
                            mensagem = m[i];
                            $('.messages ul').html("");

                            for (let i in mensagem.mensagens)
                                loadMessage(mensagem.mensagens[i].mensagem, mensagem.mensagens[i].enviada_pelo_cliente === "1");

                            lastMessageData = mensagem.mensagens[mensagem.mensagens.length - 1].data;
                            $(".messages").animate({scrollTop: $(".messages")[0].scrollHeight}, 0);

                            if (mensagem.aceitou === 0) {
                                $(".message-input-buy").css("display", "block");
                                $(".btn-buy").off("click").on("click", function () {
                                    if (!sendRequestBuy) {
                                        sendRequestBuy = !0;
                                        post("site-maocheia", "openMessage", {id: mensagem.id}, function (g) {
                                            sendRequestBuy = !1;
                                            if (g) {
                                                $(".message-input").css("display", "block");
                                                $(".message-input-buy").css("display", "none");
                                            }
                                        });
                                    }
                                });
                            } else {
                                $(".message-input").css("display", "block");
                            }

                            break;
                        }
                    }
                })
            });
        } else {
            /**
             * Lê as mensagens do profissional com este cliente
             */
            clearInterval(updateMessageLoop);
            db.exeRead("mensagens", mensagem.id).then(m => {
                mensagem = m;

                for (let i in mensagem.mensagens) {
                    if (mensagem.mensagens[i].data > lastMessageData && ((USER.setor === "clientes" && mensagem.mensagens[i].enviada_pelo_cliente === "0") || (USER.setor === "profissional" && mensagem.mensagens[i].enviada_pelo_cliente === "1")))
                        loadMessage(mensagem.mensagens[i].mensagem, mensagem.mensagens[i].enviada_pelo_cliente === "1");
                }

                lastMessageData = mensagem.mensagens[mensagem.mensagens.length - 1].data;
                $(".messages").animate({scrollTop: $(".messages")[0].scrollHeight}, "fast");

                updateMessagesLoop();
            })
        }
    }
}

function readAllMessages() {
    db.exeRead("mensagens").then(mensagens => {
        $(".nomessage").css("display", "block");
        if (!isEmpty(mensagens)) {
            $("#nomessage").html("");
            getTemplates().then(tpl => {
                for (let i in mensagens) {
                    mensagens[i].calendar = moment(mensagens[i].mensagens[mensagens[i].mensagens.length - 1].data).calendar().toLowerCase();
                    mensagens[i].lastMessage = mensagens[i].mensagens[mensagens[i].mensagens.length - 1].mensagem;
                    mensagens[i].chatId = USER.setor === "clientes" ? mensagens[i].profissional : mensagens[i].cliente;
                    if (USER.setor === "profissional") {
                        db.exeRead("clientes", parseInt(mensagens[i].cliente)).then(cliente => {
                            mensagens[i].clienteData = cliente;
                            console.log(mensagens[i]);
                            mensagens[i].clienteData.imagem = isEmpty(mensagens[i].clienteData.imagem) ? HOME + VENDOR + "site-maocheia/public/assets/svg/account.svg" : mensagens[i].clienteData.imagem[0].urls['100'];
                            $("#nomessage").append(Mustache.render(tpl.cardMensagens, mensagens[i]));
                        })
                    } else if (USER.setor === "clientes") {
                        db.exeRead("profissional", parseInt(mensagens[i].profissional)).then(profissional => {
                            mensagens[i].clienteData = profissional;
                            mensagens[i].clienteData.imagem = isEmpty(mensagens[i].clienteData.imagem_de_perfil) ? HOME + VENDOR + "site-maocheia/public/assets/svg/account.svg" : mensagens[i].clienteData.imagem_de_perfil[0].urls['100'];
                            $("#nomessage").append(Mustache.render(tpl.cardMensagens, mensagens[i]));
                        })
                    }
                }
            });
        } else {

        }
    });
}

var contato = {}, lastMessageData = null, sendRequestBuy = !1, updateMessageLoop, messageId = null;
$(function () {
    let url = location.href.split("/");
    url = url[url.length - 1];
    if(url !== "mensagem" && !isNaN(url) && url > 0)
        messageId = parseInt(url);

    if (messageId) {
        $(".message").css("display", "block");
        readMessage();
    } else {
        readAllMessages();
    }

    updateMessagesLoop();

    $(window).on('keydown', function (e) {
        if (e.which === 13) {
            sendMessage();
            return false;
        }
    });
});