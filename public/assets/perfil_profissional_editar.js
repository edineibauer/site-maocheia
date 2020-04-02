var imagem_de_perfil = [], imagem_de_fundo = [], galeria = [], profissional = null;

$(function () {
    profissional = JSON.parse(USER.setorData.perfil_profissional)[0];
    profissional.categoria = parseInt(profissional.categoria);
    dbLocal.exeRead("categorias").then(categorias => {
        $("#categoria").html("");
        if (!isEmpty(categorias)) {
            for (let i in categorias)
                $("#categoria").append("<option value='" + categorias[i].id + "'" + (profissional.categoria === categorias[i].id ? " selected='selected'" : "") + ">" + categorias[i].nome + "</option>");
        }
    });

    imagem_de_perfil = profissional.imagem_de_perfil;
    imagem_de_fundo = profissional.imagem_de_fundo;
    galeria = profissional.galeria || [];

    $("#sobre").val(profissional.sobre);
    $("#imagem_de_perfil_preview").addClass("image").html("<img src='" + profissional.imagem_de_perfil[0].urls[100] + "' alt='" + USER.nome + "' />");
    $("#imagem_de_fundo_preview").addClass("image").html("<img src='" + profissional.imagem_de_fundo[0].urls[300] + "' alt='" + USER.nome + "' />");

    if (!isEmpty(profissional.galeria)) {
        for (let i in profissional.galeria) {
            $("#galeria_preview").append("<img src='" + profissional.galeria[i].urls[300] + "' alt='" + USER.nome + "' />");
        }
    }

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

    $("#imagem_de_fundo").off("change").on("change", function (e) {
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
                            $("#imagem_de_fundo_preview").addClass("image").html("<img src='" + mock.url + "' alt='" + nome + "' />");
                        }
                    });
                    imagem_de_fundo = [];
                    imagem_de_fundo.push(mock);
                })
            }
        }
    });

    $("#galeria").off("change").on("change", function (e) {
        let $input = $(this);
        if (typeof e.target.files[0] !== "undefined") {
            for (let i in e.target.files) {
                let file = e.target.files[i];
                if(typeof file.name !== "undefined") {
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
                                    $("#galeria_preview").append("<img src='" + mock.url + "' alt='" + nome + "' />");
                                }
                            });
                            galeria.push(mock);
                        })
                    }
                }
            }
        }
    });

    $("#scrollDown").off("click").on("click", function () {
        window.scrollBy(0, 100);
    });

    $("#update-profissional").off("click").on("click", function () {
        let rel = $(this).attr("rel");
        let p = {
            "categoria": $("#categoria").val(),
            "sobre": $("#sobre").val(),
            "imagem_de_perfil": imagem_de_perfil,
            "imagem_de_fundo": imagem_de_fundo,
            "galeria": galeria,
            "ativo": !0,
        };

        if (isEmpty(p.categoria)) {
            toast("informe a categoria", 2000, "toast-warning");
        } else if (isEmpty(p.sobre)) {
            toast("Defina seu Trabalho em Sobre", 2500, "toast-warning");
        } else {
            p.id = Date.now() + Math.floor((Math.random() * 1000) + 1);
            p.formIdentificador = Date.now() + Math.floor((Math.random() * 1000) + 1);
            p.columnTituloExtend = "<small class='color-gray left opacity padding-tiny radius'>categoria</small><span style='padding: 1px 5px' class='left padding-right font-medium td-title'> " + $("#categoria :selected").text() + "</span>";
            p.columnName = "perfil_profissional";
            p.columnRelation = "profissional";
            p.columnStatus = {column: "", have: "false", value: "false"};
            db.exeCreate("clientes", {
                id: USER.setorData.id,
                nome: USER.setorData.nome,
                perfil_profissional: [p]
            }).then(r => {
                if (r.db_errorback === 0) {
                    toast("Perfil atualizado!", 1400, "toast-success");
                    USER.setorData.perfil_profissional = r.perfil_profissional;
                    if (rel === "1") {
                        setTimeout(function () {
                            pageTransition("profissional");
                        }, 1000);
                    }
                }
            });
        }
    });
});