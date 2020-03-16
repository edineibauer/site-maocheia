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
                    let destino = "dashboard";
                    if(getCookie("redirectOnLogin") !== ""){
                        destino = getCookie("redirectOnLogin");
                        setCookie("redirectOnLogin", 1 ,-1);
                    }
                    pageTransition(destino, "route", "forward", "#core-content");
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
        pageTransition("dashboard", "route", "fade", "#core-content", null, null, !1);

    $("#app").off("keyup", "#email, #senha").on("keyup", "#email, #senha", function (e) {
        if (e.which === 13)
            login()
    })
});