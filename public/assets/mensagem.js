var mensagem = [];
$(".messages").animate({scrollTop: $(document).height()}, "fast");

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
    ;

    $("#status-options").removeClass("active");
});

function newMessage(content, sendByClient) {
    if($.trim(content).length) {
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

        db.exeCreate("mensagens", mensagem).then(result => {
            console.log(result);
        });
    }
}

function loadMessage(content, sendByClient) {
    if($.trim(content).length) {
        let type = (sendByClient && USER.setor === "clientes") || (!sendByClient && USER.setor === "profissional") ? "replies" : "sent";
        $('<li class="' + type + '"><p>' + content + '<small>' + moment().format("HH:mm") + '</small></p></li>').appendTo($('.messages ul'));
        $('.message-input input').val(null);
        $(".messages").animate({scrollTop: $(document).height()}, "fast");
    }

    return content;
}

function sendMessage() {
    newMessage($(".message-input input").val(), USER.setor === "clientes");
}

$('.submit').click(function () {
    sendMessage();
});

$(window).on('keydown', function (e) {
    if (e.which == 13) {
        sendMessage();
        return false;
    }
});

var contato = {};
var sendRequestBuy = !1;
$(function () {
    if(USER.setor === "clientes") {
        /**
         * Lê o profissional
         */
        db.exeRead("profissional", parseInt(FRONT.VARIAVEIS[0])).then(perfil => {
            contato = perfil;
            let imagem = perfil.imagem_de_perfil !== null && typeof perfil.imagem_de_perfil !== "undefined" ? perfil.imagem_de_perfil[0].urls['100'] : HOME + VENDOR + "site-maocheia/public/assets/svg/account.svg";
            $("#perfil-info").html('<img src="' + imagem + '" alt=""/><p>' + perfil.nome + '</p>');

            /**
             * Lê as mensagens do cliente com este profissional
             */
            db.exeRead("mensagens").then(m => {
                for (let i in m) {
                    if (parseInt(m[i].profissional) === contato.id) {
                        mensagem = m[i];
                        $(".message-input").css("display", "block");

                        for (let i in mensagem.mensagens)
                            loadMessage(mensagem.mensagens[i].mensagem, mensagem.mensagens[i].enviada_pelo_cliente === "1");

                        break;
                    }
                }
            })
        });
    } else if(USER.setor === "profissional") {
        /**
         * Lê o cliente
         */
        db.exeRead("clientes", parseInt(FRONT.VARIAVEIS[0])).then(perfil => {
            contato = perfil;
            let imagem = perfil.imagem !== null && typeof perfil.imagem !== "undefined" ? perfil.imagem[0].urls['100'] : HOME + VENDOR + "site-maocheia/public/assets/svg/account.svg";
            $("#perfil-info").html('<img src="' + imagem + '" alt=""/><p>' + contato.nome + '</p>');

            /**
             * Lê as mensagens do profissional com este cliente
             */
            db.exeRead("mensagens").then(m => {
                for (let i in m) {
                    if (parseInt(m[i].cliente) === contato.id) {
                        mensagem = m[i];

                        for (let i in mensagem.mensagens)
                            loadMessage(mensagem.mensagens[i].mensagem, mensagem.mensagens[i].enviada_pelo_cliente === "1");

                        if(mensagem.aceitou === 0) {
                            $(".message-input-buy").css("display", "block");
                            $(".btn-buy").off("click").on("click", function() {
                                if(!sendRequestBuy) {
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
    }
});