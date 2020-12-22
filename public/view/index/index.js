function busca(nome) {
    nome = typeof nome !== "undefined" ? nome : $("#search").val();
    pageTransition("agendar/" + nome);
}

$(function() {
    $("#search").off("keyup change").on("keyup change", function (e) {
        if(e.keyCode === 13)
            busca();
    })
})