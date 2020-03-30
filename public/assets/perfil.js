$(function () {
    let profissional = null;
    let userImage = HOME + VENDOR + "site-maocheia/public/assets/svg/account.svg";
    if(!isEmpty(USER.setorData.perfil_profissional) && typeof USER.setorData.perfil_profissional === "string" && isJson(USER.setorData.perfil_profissional)) {
        $("#saldoProfissional").removeClass("hide");
        $("#setor-profissional").htmlTemplate('perfilProfissionalConfig');
        profissional = JSON.parse(USER.setorData.perfil_profissional)[0];
        $("#moedas").html(USER.setorData.moedas);
        $("#avaliacao-perfil-profissional").profissionalStar(USER.setorData.avaliacao_profissional);
        $("#preco-perfil-profissional").profissionalPreco(USER.setorData.preco_justo);
    } else {
        $("#setor-profissional").htmlTemplate('perfilProfissionalOpen');
        userImage = !isEmpty(USER.setorData.imagem) ? JSON.parse(USER.setorData.imagem)[0].urls['100'] : HOME + VENDOR + "site-maocheia/public/assets/svg/account.svg";
    }

    $("#perfil-image").css("background-image", "url('" + (profissional ? profissional.imagem_de_perfil[0].urls[100] : userImage) + "')");

    $(".sair-app").off("click").on("click", function() {
        logoutDashboard();
    });
});