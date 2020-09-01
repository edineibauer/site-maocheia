function clearForm($input) {
    $input.css("border-bottom-color", "#CECECE").siblings("label").css("color", "#707070");
}

$(function() {
    $(".form-group").find("input").off("keyup").on("keyup", function() {
        clearForm($(this));
    });

    $("#btn-tela-cadastro").on("click", function() {
        db.exeCreate("clientes", {
            nome: $('#nomec').val(),
            email: $('#emailc').val(),
            senha: $('#senhac').val(),
            ativo: 1
        }).then(async result => {
            if(result.response === 1) {
                let g = await AJAX.post('login',  {email: result.data.nome.toLowerCase(), pass: $('#senhac').val()});

                if (typeof g === "string") {
                    navigator.vibrate(100);
                    if (g !== "no-network")
                        toast(g, 3000, "toast-warning");
                } else {
                    toast("Seja Bem-vindo " + result.data.nome, 1500, "toast-success");
                    setCookieUser(g).then(() => {
                        setTimeout(function () {
                            pageTransition("index");
                        }, 500);
                    });
                }

            } else {
                dbLocal.clear("clientes");
                navigator.vibrate(100);

                for(let i in result.data.clientes) {
                    toast(i + ": " + result.data.clientes[i]);
                    $("#" + i + "c").css("border-bottom-color", "red").siblings("label").css("color", "red");
                }
            }
        });
    });
});