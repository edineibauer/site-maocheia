$(function() {
    let p = Object.assign({}, USER.setorData);
    p.perfil_profissional = JSON.parse(p.perfil_profissional)[0];
    let data = getProfissionalMustache(p);
    data.distanciaKm = "0m";
    $("#profissional-perfil").htmlTemplate('servicePerfil', data).then(() => {
        $("#arrowback-perfil").off("click").on("click", function () {
            pageTransition("perfil", "route", "back");
        })
    });
});