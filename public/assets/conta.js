function setProfissionalForm(profissional) {
    $("#nome").val(profissional.nome);
    $("#email").val(profissional.email);
    $("#cpf").val(profissional.cpf);
    $("#telefone").val(profissional.telefone);
}

$(function () {
    setProfissionalForm(USER.setorData);

    setTimeout(function () {
        $(".form-control").removeAttr("disabled readonly");
    }, 1000);

    $("#salvar").click(function () {
        let user = {
            "nome": $("#nome").val(),
            "email": $("#email").val(),
            "cpf": $("#cpf").val(),
            "telefone": $("#telefone").val(),
            "senha": $("#senha").val()
        };

        console.log(user);
    });
});