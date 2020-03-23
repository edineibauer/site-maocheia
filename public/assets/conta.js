function setProfissionalForm(profissional, setor) {
    $("#nome").val(profissional.nome);
    $("#email").val(profissional.email);
    $("#cpf").val(profissional.cpf);
    $("#telefone").val(profissional.telefone);
    $("#titulo").text(profissional.nome);

    if(setor === "profissional") {
        $("#setor-endereco").removeClass("hide");
        var enderecos = JSON.parse(profissional.endereco);
        $("#endereco").val(enderecos[0].rua);
    }
}

$(function() {
    setProfissionalForm(USER.setorData, USER.setor);

    setTimeout(function () {
        $(".form-control").removeAttr("disabled readonly");
    },1000);

    $("#salvar").click(function() {
    });
});