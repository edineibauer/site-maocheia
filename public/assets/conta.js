var imagem_de_perfil = [];

function setProfissionalForm(profissional) {
    $("#nome").val(profissional.nome);
    $("#email").val(profissional.email);
    $("#cpf").val(profissional.cpf);
    $("#telefone").val(profissional.telefone);
    $("#imagem_de_perfil_preview").addClass("image").html("<img src='" + (!isEmpty(profissional.imagem) ? JSON.parse(profissional.imagem)[0].urls.thumb : HOME + VENDOR + "site-maocheia/public/assets/svg/account.svg") + "' alt='" + USER.nome + "' />");
    imagem_de_perfil = (!isEmpty(profissional.imagem) ? JSON.parse(profissional.imagem) : []);
}

$(function () {
    setProfissionalForm(USER.setorData);

    setTimeout(function () {
        $(".form-control").removeAttr("disabled readonly");
    }, 1000);

    $("#imagem_de_perfil").off("change").on("change", function (e) {
        let $input = $(this);
        if (typeof e.target.files[0] !== "undefined") {
            let file = e.target.files[0];
            let name = file.name.split(".");
            name = name.join('-');
            let nome = replaceAll(replaceAll(name, '-', ' '), '_', ' ');
            name = slug(name);
            if (/^image\//.test(file.type)) {
                compressImage(file, 1920, 1080, webp("jpg"), function (resource) {
                    var size = parseFloat(4 * Math.ceil(((resource.length - 'data:image/png;base64,'.length) / 3)) * 0.5624896334383812).toFixed(1);
                    let mock = createMock(resource, nome, name, webp("jpg"), "image/" + webp("jpg"), size, !0);

                    let fileUp = dataURLtoFile(mock.url, mock.name + "." + mock.type);
                    let upload = new Upload(fileUp);
                    upload.exeUpload(mock, $input, function (data) {
                        if (data.url !== "") {
                            mock.url = data.url;
                            mock.image = data.image;
                            $("#imagem_de_perfil_preview").addClass("image").html("<img src='" + mock.url + "' alt='" + nome + "' />");
                        }
                    });
                    imagem_de_perfil = [];
                    imagem_de_perfil.push(mock);
                })
            }
        }
    });

    $("#salvar").click(function () {
        let user = {
            "id": USER.setorData.id,
            "nome": $("#nome").val(),
            "email": $("#email").val(),
            "cpf": $("#cpf").val(),
            "telefone": $("#telefone").val(),
            "imagem": imagem_de_perfil,
            "senha": $("#senha").val()
        };

        db.exeCreate("clientes", user).then(r => {
            if(r.db_errorback === 0) {
                toast("Salvo!", 1500, "toast-success");
                USER.setorData.nome = r.nome;
                USER.setorData.email = r.email;
                USER.setorData.cpf = r.cpf;
                USER.setorData.telefone = r.telefone;
                USER.setorData.imagem = r.imagem;
            } else {
                toast("erro", 1500, "toast-error");
            }
        });
    });
});