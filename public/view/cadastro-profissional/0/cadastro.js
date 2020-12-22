function clearForm($input) {
    $input.css("border-bottom-color", "#CECECE").siblings("label").css("color", "#707070");
}

function isEmail(value) {
    var result = !0;
    if (value === "" || value === null)
        return !0;
    $.each([" ", ",", "_", "!", "?", "|", "'", '"', "#", "$", "%", "¨", "&", "*", "(", ")", "¬", "¢", "£", "³", "²", "¹", ";", "/", "\\", "]", "[", "{", "}", "°", "º", "~", ":", "´", "`", "ª", "=", "§", "+"], function (i, e) {
        if (value.indexOf(e) > -1) {
            result = !1;
            return !1
        }
    })
    if (result && value.indexOf("@") < 2)
        return !1;
    return result
}

$(function() {
    $(".form-group").find("input").off("keyup").on("keyup", function() {
        clearForm($(this));
    });

    $("#btn-tela-cadastro").on("click", function() {

        let user = {
            nome: $('#nomec').val(),
            email: $('#emailc').val(),
            telefone: parseInt($('#telc').val()),
            senha: $('#senhac').val(),
            ativo: 1
        };

        if(user.nome.length < 3) {
            toast("Mínimo de 3 caracteres nome");
            $("#nomec").css("border-bottom-color", "red").siblings("label").css("color", "red");
        } else if(isEmpty(user.telefone)) {
            toast("Preencha seu telefone");
            $("#telc").css("border-bottom-color", "red").siblings("label").css("color", "red");
        } else if(user.telefone.toString().length < 11) {
            toast("Números de telefone ausentes");
            $("#telc").css("border-bottom-color", "red").siblings("label").css("color", "red");
        } else if(isEmpty(user.email)) {
            toast("Preencha seu email");
            $("#emailc").css("border-bottom-color", "red").siblings("label").css("color", "red");
        } else if(!isEmail(user.email)) {
            toast("Formato de email inválido");
            $("#emailc").css("border-bottom-color", "red").siblings("label").css("color", "red");
        } else if(user.senha.length < 4) {
            toast("Senha mínima 4 caracteres");
            $("#senhac").css("border-bottom-color", "red").siblings("label").css("color", "red");
        } else {

            db.exeCreate("clientes", user).then(async result => {
                loginFree = !0;

                if(result.response === 1) {
                    let g = await AJAX.post('login',  {email: result.data.nome.toLowerCase(), pass: user.senha});

                    if (typeof g === "string") {
                        navigator.vibrate(100);
                        if (g !== "no-network")
                            toast(g, 3000, "toast-warning");
                    } else {
                        toast("Ok, avançando...", 1500, "toast-success");
                        setCookieUser(g).then(() => {
                            setTimeout(function () {
                                pageTransition("perfil_profissional_cadastro");
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
        }
    });
});