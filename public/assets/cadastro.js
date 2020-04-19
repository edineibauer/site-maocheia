function clearForm($input) {
    $input.css("border-bottom-color", "#CECECE").siblings("label").css("color", "#707070");
}

$(function() {

    $(".form-group").find("input").off("keyup").on("keyup", function() {
        clearForm($(this));
    });

    $("#btn-tela-cadastro").on("click", function() {
        db.exeCreate("clientes", {
            nome: $('#nome').val(),
            email: $('#email').val(),
            senha: $('#senha').val(),
            ativo: 1
        }).then(result => {
            loginFree = !0;
            if(typeof result.db_errorback !== "undefined" && result.db_errorback === 1) {
                dbLocal.clear("clientes");
                delete(result.db_errorback);
                navigator.vibrate(100);

                for(let i in result) {
                    toast(i + ": " + result[i], 2000, "toast-warning");
                    $("#" + i).css("border-bottom-color", "red").siblings("label").css("color", "red");
                }

            } else if(result.db_errorback === 0) {
                post('login', 'login', {email: result.nome, pass: $('#senha').val()}, function (g) {
                    if (typeof g === "string") {
                        navigator.vibrate(100);
                        if (g !== "no-network")
                            toast(g, 3000, "toast-warning")
                    } else {
                        toast("Seja bem-vindo, entrando...", 1500, "toast-success");
                        setCookieUser(g).then(() => {
                            let destino = "index";
                            if(getCookie("redirectOnLogin") !== ""){
                                destino = getCookie("redirectOnLogin");
                                setCookie("redirectOnLogin", 1 ,-1);
                            }
                            location.href = destino;
                        })
                    }
                });
            }
        });
    });
});