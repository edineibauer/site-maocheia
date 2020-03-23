$(function () {
    if(USER.setor === "profissional") {
        $("#saldoProfissional").removeClass("hide");
        $("#setor-profissional").htmlTemplate('perfilProfissionalConfig');
        $("#moedas").html(USER.setorData.moedas);
    } else {
        $("#setor-profissional").htmlTemplate('perfilProfissionalOpen');
    }

    $(".sair-app").off("click").on("click", function() {
        logoutDashboard();
    });
});