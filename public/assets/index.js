if(HOMEPAGE === "1") {
    if (getCookie("token") !== "" && getCookie("token") !== "0") {
        if(USER.setor !== "clientes")
            pageTransition("dashboard", "route", "forward", "#core-content", null, null, !1);
    } else {
        pageTransition("login", "route", "forward", "#core-content", null, null, !1);
    }
}