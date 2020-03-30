$(function () {
    if(!isEmpty(USER.setorData.perfil_profissional) && typeof USER.setorData.perfil_profissional === "string" && isJson(USER.setorData.perfil_profissional)) {
        $("#saldoProfissional").removeClass("hide");
        $("#setor-profissional").htmlTemplate('perfilProfissionalConfig');
        $("#moedas").html(JSON.parse(USER.setorData.perfil_profissional)[0].moedas);
    } else {
        $("#setor-profissional").htmlTemplate('perfilProfissionalOpen');
    }

    $(".sair-app").off("click").on("click", function() {
        logoutDashboard();
    });
});