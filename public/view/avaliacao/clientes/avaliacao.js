var profissional = FRONT.VARIAVEIS[0], accept = 0, read = new Read();

if(isNumberPositive(profissional)) {
    read.exeRead("clientes", profissional).then(p => {
        if (isEmpty(p)) {
            toast("Profissional não encontrado", "toast-error", 2000);
            setTimeout(function () {
                history.back();
            }, 500);
        } else {
            $("#avaliacao-title").html("<small>avaliação</small> " + p.nome);
            accept++;
        }
    });
} else {
    toast("Profissional não encontrado", "toast-error", 2000);
    setTimeout(function () {
        history.back();
    }, 500);
}

getJSON(HOME + "app/find/avaliacao/cliente/" + USER.setorData.id).then(ava => {
    accept++;
    if(!isEmpty(ava.avaliacao)) {
        for(let avaliacao of ava.avaliacao) {
            if(avaliacao.profissional === profissional) {
                accept--;
                toast("profissional já avaliado!", 3000, "toast-infor");
                setTimeout(function () {
                    history.back();
                }, 500);
            }
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
                "cliente": parseInt(USER.setorData.id),
                "data": moment().format("YYYY-MM-DD HH:mm:ss"),
                "nome_do_cliente": USER.nome,
                "imagem_do_cliente": (!isEmpty(USER.setorData.imagem) ? JSON.parse(USER.setorData.imagem)[0].url : !isEmpty(USER.imagem) ? USER.imagem.url : !isEmpty(USER.setorData.perfil_profissional) ? JSON.parse(USER.setorData.perfil_profissional)[0].imagem_de_perfil[0].url : "")
            };

            db.exeCreate("avaliacao", dados).then(result => {
                if (!isEmpty(result)) {
                    toast("Obrigado, a sua avaliação foi enviada!", "toast-success", 2500);
                    setTimeout(function () {
                        history.back();
                    }, 500);
                }
            })
        } else if(accept === 1) {
            toast("Você não pode avaliar seu próprio perfil", "toast-info", 3000);
        } else {
            toast("Aguarde e tente novamente", "toast-warning", 2000);
        }
    });
})