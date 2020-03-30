var loginFree = !0;

function login() {
    if (loginFree) {
        $("#login").loading();
        loginFree = !1;
        var email = $("#email").val();
        var pass = $("#senha").val();
        toast("Validando dados!", 15000);
        post('login', 'login', {email: email, pass: pass}, function (g) {
            if (typeof g === "string") {
                navigator.vibrate(100);
                loginFree = !0;
                if (g !== "no-network")
                    toast(g, 3000, "toast-warning")
            } else {
                setCookieUser(g).then(() => {
                    let destino = "index";
                    if(getCookie("redirectOnLogin") !== ""){
                        destino = getCookie("redirectOnLogin");
                        setCookie("redirectOnLogin", 1 ,-1);
                    }
                    location.href = destino;
                })
            }
        })
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
    })
});