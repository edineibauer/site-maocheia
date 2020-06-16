var loginFree = !0;

function login() {
    exeLogin($("#email").val(), $("#senha").val(), $("#g-recaptcha-response").val());
}

function exeLogin(email, senha, recaptcha) {
    if (loginFree) {
        $("#login").loading();
        loginFree = !1;
        post('login', 'login', {email: email, pass: senha, recaptcha: recaptcha}, function (g) {
            if (typeof g === "string") {
                loginFree = !0;
                navigator.vibrate(100);
                if (g !== "no-network")
                    toast(g, 3000, "toast-warning")
            } else {
                toast("Bem-vindo ao " + SITENAME, 15000, "toast-success");
                setCookieUser(g).then(() => {
                    let destino = "index";
                    if(g.setor !== "clientes")
                        destino = "dashboard";
                    if (getCookie("redirectOnLogin") !== "") {
                        destino = getCookie("redirectOnLogin");
                        setCookie("redirectOnLogin", 1, -1);
                    }
                    location.href = destino;
                })
            }
        });
    }
}

/**
 * login Social work with the user data to
 * create a new user or login
 */
function loginSocial(profile) {
    //search for the user email
    getJSON(HOME + "app/find/clientes/email/" + profile.email).then(r => {
        if (!isEmpty(r.clientes)) {
            exeLogin(profile.email, profile.id)
        } else {
            db.exeCreate("clientes", {
                nome: profile.name,
                email: profile.email,
                imagem_url: profile.image,
                senha: profile.id,
                ativo: 1
            }).then(result => {
                if (result.db_errorback === 0)
                    exeLogin(result.email, profile.id)
            })
        }
    });
}

function loginFacebook(profile) {
    loginSocial(profile);
}

function loginGoogle(profile) {
    loginSocial(profile);
}

$(function () {

    $("#btn-tela-cadastro").off("click").on("click", function () {
        login();
    });

    if (getCookie("token") !== "" && getCookie("token") !== "0")
        location.href = HOME + "dashboard";

    $("#app").off("keyup", "#email, #senha").on("keyup", "#email, #senha", function (e) {
        if (e.which === 13)
            login()

    }).on("click", ".abcRioButtonContentWrapper", function() {
        googleLogin = 1;
    });
});