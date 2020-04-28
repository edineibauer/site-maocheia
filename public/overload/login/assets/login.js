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

var googleLogin = 0;
function onSignIn(googleUser) {
    if(googleLogin === 0) {
        gapi.auth2.getAuthInstance().signOut();

    } else {
        var profile = googleUser.getBasicProfile();
        getJSON(HOME + "app/find/clientes/email/" + profile.getEmail()).then(r => {
            if (!isEmpty(r.clientes)) {
                exeLogin(profile.getEmail(), profile.getId())
            } else {
                db.exeCreate("clientes", {
                    nome: profile.getName(),
                    email: profile.getEmail(),
                    imagem_url: profile.getImageUrl(),
                    senha: profile.getId(),
                    ativo: 1
                }).then(result => {
                    if (result.db_errorback === 0)
                        exeLogin(result.email, profile.getId())
                })
            }
        });
    }
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