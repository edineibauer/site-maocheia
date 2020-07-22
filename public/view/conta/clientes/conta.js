var imagem_de_perfil = [];

function setProfissionalForm(profissional) {
    imagem_de_perfil = (!isEmpty(profissional.imagem) ? (isJson(profissional.imagem) ? JSON.parse(profissional.imagem) : profissional.imagem) : [])
    $("#nome").val(profissional.nome);
    $("#email").val(profissional.email);
    $("#cpf").val(profissional.cpf);
    $("#telefone").val(profissional.telefone);
    $("#imagem_de_perfil_preview").addClass("image").html("<img src='" + (isEmpty(imagem_de_perfil) ? HOME + VENDOR + "site-maocheia/public/assets/svg/account.svg" : imagem_de_perfil[0].url) + "' alt='" + USER.nome + "' />");
}

$(function () {
    setProfissionalForm(USER.setorData);

    setTimeout(function () {
        $(".form-control").removeAttr("disabled readonly");
    }, 1000);

    $("#imagem_de_perfil").off("change").on("change", function (e) {
        if (typeof e.target.files[0] !== "undefined") {
            AJAX.uploadFile(e.target.files).then(upload => {
                $("#imagem_de_perfil_preview").addClass("image").html("<img src='" + upload[0].url + "' alt='" + upload[0].nome + "' />");
                imagem_de_perfil = [];
                imagem_de_perfil.push(upload[0]);
            });
        }
    });

    $("#salvar").click(function () {
        setUserData({
            "nome": $("#nome").val(),
            "email": $("#email").val(),
            "cpf": $("#cpf").val(),
            "telefone": $("#telefone").val(),
            "imagem": imagem_de_perfil,
            "senha": $("#senha").val()
        });
        toast("salvo com sucesso", 1500, "toast-success");
        history.back();
    });
});