function solicitarProfissional() {
    $("#profissionalC").addClass("hide");
    $("#profissionalP").removeClass("hide");
    AJAX.post("solicitar", {"urgencia": PARAM[0], "problema": PARAM[1]});
}