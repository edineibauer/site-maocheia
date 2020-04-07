var imagem_de_perfil = [], imagem_de_fundo = [], galeria = [];



function compressImage(file, MAX_WIDTH, MAX_HEIGHT, format, response) {
    var img = document.createElement("img");
    var reader = new FileReader();
    reader.onload = function (e) {
        if (e.target.error != null) {
            console.error("File could not be read! Code " + e.target.error.code);
            response("")
        } else {
            img.src = e.target.result;
            img.onload = function () {
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");
                let width = img.width;
                let height = img.height;
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH
                    }
                } else if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                response(canvas.toDataURL("image/" + format))
            }
        }
    };
    reader.readAsDataURL(file)
}

$(function () {
    dbLocal.exeRead("categorias").then(categorias => {
        $("#categoria").html("<option disabled='disabled' selected='selected' value=''>Selecione...</option>");
        for (let i in categorias) {
            $("#categoria").append("<option value='" + categorias[i].id + "'>" + categorias[i].nome + "</option>");
        }
    });

    $("#imagem_de_perfil").off("change").on("change", function (e) {
        let $input = $(this);
        if (typeof e.target.files[0] !== "undefined") {
            let file = e.target.files[0];
            let name = file.name.split(".");
            name = name.join('-');
            let nome = replaceAll(replaceAll(name, '-', ' '), '_', ' ');
            name = slug(name);
            if (/^image\//.test(file.type)) {
                compressImage(file, 1920, 1080, "jpg", function (resource) {
                    var size = parseFloat(4 * Math.ceil(((resource.length - 'data:image/png;base64,'.length) / 3)) * 0.5624896334383812).toFixed(1);
                    let mock = createMock(resource, nome, name, "jpg", "image/jpg", size, !0);

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
                compressImage(file, 1920, 1080, "jpg", function (resource) {
                    var size = parseFloat(4 * Math.ceil(((resource.length - 'data:image/png;base64,'.length) / 3)) * 0.5624896334383812).toFixed(1);
                    let mock = createMock(resource, nome, name, "jpg", "image/" + "jpg", size, !0);

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
                        compressImage(file, 1920, 1080, "jpg", function (resource) {
                            var size = parseFloat(4 * Math.ceil(((resource.length - 'data:image/png;base64,'.length) / 3)) * 0.5624896334383812).toFixed(1);
                            let mock = createMock(resource, nome, name, "jpg", "image/" + "jpg", size, !0);

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

    $("#create-profissional").off("click").on("click", function () {
        let profissional = {
            "categoria": $("#categoria").val(),
            "sobre": $("#sobre").val(),
            "imagem_de_perfil": imagem_de_perfil,
            "imagem_de_fundo": imagem_de_fundo,
            "galeria": galeria,
            "ativo": !0,
        };

        if (isEmpty(profissional.categoria)) {
            toast("informe a categoria", 2000, "toast-warning");
        } else if (isEmpty(profissional.sobre)) {
            toast("Defina seu Trabalho em Sobre", 2500, "toast-warning");
        } else if (isEmpty(profissional.imagem_de_perfil)) {
            toast("Defina uma imagem de perfil", 2500, "toast-warning");
        } else if (isEmpty(profissional.imagem_de_fundo)) {
            toast("Defina uma imagem de fundo", 2500, "toast-warning");
        } else {
            profissional.id = Date.now() + Math.floor((Math.random() * 1000) + 1);
            profissional.formIdentificador = Date.now() + Math.floor((Math.random() * 1000) + 1);
            profissional.columnTituloExtend = "<small class='color-gray left opacity padding-tiny radius'>categoria</small><span style='padding: 1px 5px' class='left padding-right font-medium td-title'> " + $("#categoria :selected").text() + "</span>";
            profissional.columnName = "perfil_profissional";
            profissional.columnRelation = "profissional";
            profissional.columnStatus = {column: "", have: "false", value: "false"};
            db.exeCreate("clientes", {id: USER.setorData.id, nome: USER.setorData.nome, perfil_profissional: [profissional]}).then(r => {
                if(r.db_errorback === 0) {
                    toast("Parabéns! Perfil criado!", 3000, "toast-success");
                    USER.setorData.perfil_profissional = r.perfil_profissional;
                    setTimeout(function () {
                        pageTransition("perfil");
                    }, 1800);
                }
            });
        }
    });
});