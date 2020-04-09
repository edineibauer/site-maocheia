$(function () {
    let p = Object.assign({}, USER.setorData);
    p.perfil_profissional = JSON.parse(p.perfil_profissional)[0];
    dbLocal.exeRead("categorias").then(categories => {
        let data = getProfissionalMustache(p, categories.find(s => s.id == result[i].perfil_profissional.categoria));
        data.distanciaKm = "0m";
        $("#profissional-perfil").htmlTemplate('servicePerfil', data).then(() => {
            $("#arrowback-perfil").off("click").on("click", function () {
                pageTransition("perfil", "route", "back");
            })
        });
    });
});