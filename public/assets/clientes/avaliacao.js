var profissional = parseInt(FRONT.VARIAVEIS[0]), accept = 0;

if(isNumberPositive(profissional)) {
    db.exeRead("profissional", profissional).then(p => {
        if (isEmpty(p)) {
            toast("Profissional não encontrado", "toast-error", 2000);
            setTimeout(function () {
                pageTransition("perfil");
            }, 2000);
        } else {
            $("#avaliacao-title").html("<small>avaliação</small> " + p.nome);
            accept++;
        }
    });
} else {
    toast("Profissional não encontrado", "toast-error", 2000);
    setTimeout(function () {
        pageTransition("perfil");
    }, 2000);
}

db.exeRead("avaliacao").then(ava => {
    accept++;
    for(let a of ava) {
        if(a.profissional == profissional) {
            accept--;
            toast("Você já avaliou este profissional! Obrigado", 3000, "toast-infor");
            setTimeout(function () {
                pageTransition("index");
            }, 3000);
            break;
        }
    }
});

$(document).ready(function () {
    $("#enviar").off("click").on("click", function () {
        if (accept > 1) {
            let dados = {
                "qualidade": parseInt($('input[name=ql]:checked').val()),
                "preco_justo": parseInt($('input[name=pj]:checked').val()),
                "atendimento": parseInt($('input[name=at]:checked').val()),
                "comentario": $("#comentario").val(),
                "profissional": profissional,
                "cliente": parseInt(USER.id),
                "data": moment().format("YYYY-MM-DD HH:mm:ss"),
                "nome_do_cliente": USER.nome,
                "imagem_do_cliente": USER.imagem || USER.setorData.imagem || (!isEmpty(USER.setorData.perfil_profissional) && !isEmpty(JSON.parse(USER.setorData.perfil_profissional)[0].imagem_de_perfil) && JSON.parse(USER.setorData.perfil_profissional)[0].imagem_de_perfil[0].urls.thumb)
            };

            console.log(dados);

            db.exeCreate("avaliacao", dados).then(result => {
                if (!isEmpty(result)) {
                    toast("Obrigado! Avaliação salva", "toast-success", 2500);
                    setTimeout(function () {
                        pageTransition("index");
                    }, 2500);
                }
                console.log(result);
            })
        } else {
            toast("Aguarde e tente novamente", "toast-warning", 2000);
        }
    });
})