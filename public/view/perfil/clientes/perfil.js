$(function () {
    let profissional = null;
    let userImage = HOME + VENDOR + "site-maocheia/public/assets/svg/account.svg";
    if(!isEmpty(USER.setorData.perfil_profissional) && typeof USER.setorData.perfil_profissional === "string" && isJson(USER.setorData.perfil_profissional)) {
        $("#saldoProfissional, #editprofissional").removeClass("hide");
        $("#openprofissional").addClass("hide");
        profissional = JSON.parse(USER.setorData.perfil_profissional)[0];
        $("#moedas").html(USER.setorData.moedas);
        $("#avaliacao-perfil-profissional").profissionalStar(USER.setorData.avaliacao_profissional);
        $("#preco-perfil-profissional").profissionalPreco(USER.setorData.preco_justo);
    } else {
        userImage = !isEmpty(USER.setorData.imagem) ? JSON.parse(USER.setorData.imagem)[0].urls.thumb : HOME + VENDOR + "site-maocheia/public/assets/svg/account.svg";
    }

    $("#nome-user").html(USER.setorData.nome);
    $("#perfil-image").css("background-image", "url('" + (profissional ? profissional.imagem_de_perfil[0].urls.thumb : userImage) + "')");

    $(".sair-app").off("click").on("click", function() {
        logoutDashboard();
    });

    $(".update-btn").one("click", function () {
        location.reload();
    });
});