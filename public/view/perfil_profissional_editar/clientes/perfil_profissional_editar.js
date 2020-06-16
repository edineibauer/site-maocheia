var imagem_de_perfil = [], imagem_de_fundo = [], galeria = [], profissional = null;

var Upload = function (file) {
    this.file = file
};

var checkUploadStoped = {};
var ajaxUploadProgress = {};
Upload.prototype.exeUpload = function (mock, $input, funcao) {
    var formData = new FormData();
    formData.append("lib", "entity");
    formData.append("file", "up/source");
    formData.append("name", mock.name);
    formData.append("fileType", mock.fileType);
    formData.append("type", mock.type);
    formData.append("upload", this.file, this.file.name);
    let atualPercent = 0;
    let lastPercent = 1;
    checkUploadStoped[mock.name] = setInterval(function () {
        if (atualPercent === lastPercent) {
            clearInterval(checkUploadStoped[mock.name]);
            if (typeof ajaxUploadProgress[mock.name] !== "undefined") {
                ajaxUploadProgress[mock.name].abort();
                delete (ajaxUploadProgress[mock.name])
            }
            delete (checkUploadStoped[mock.name]);
            $(".progress-wrp[rel='" + mock.name + "'] .progress-bar").css("background-color", "#d3d3d3");
            $(".progress-wrp[rel='" + mock.name + "'] .status").css("left", "41%").html("<span style='color:#e02d36'>FALHA</span>");
            removeFileForm($(".remove-file-gallery[rel='" + mock.name + "']"), 2000);
            toast("Envio de arquivo cancelado. Demorou muito a responder!", 7000, "toast-error")
        } else {
            atualPercent = lastPercent
        }
    }, 25000);
    ajaxUploadProgress[mock.name] = $.ajax({
        type: "POST", enctype: 'multipart/form-data', url: HOME + "set/", xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                myXhr.upload.addEventListener('progress', function (event) {
                    let percent = 0;
                    let position = event.loaded || event.position;
                    let total = event.total;
                    let progress_bar_id = ".progress-wrp[rel='" + mock.name + "']";
                    if (event.lengthComputable)
                        percent = Math.ceil(position / total * 100);
                    lastPercent = percent;
                    $(progress_bar_id + " .progress-bar").css("width", +percent + "%");
                    $(progress_bar_id + " .status").text(percent + "%")
                }, !1)
            }
            return myXhr
        }, success: function (data) {
            clearInterval(checkUploadStoped[mock.name]);
            if (data.response === 1) {
                funcao(data.data);
                delete (ajaxUploadProgress[mock.name]);
                delete (checkUploadStoped[mock.name]);
                $(".progress-wrp[rel='" + mock.name + "'] .status").css("left", "46%").html("<span style='color:#fff'>OK</span>");
                setTimeout(function () {
                    $(".progress-wrp[rel='" + mock.name + "']").addClass("hide")
                }, 1000)
            } else {
                clearInterval(checkUploadStoped[mock.name]);
                delete (ajaxUploadProgress[mock.name]);
                delete (checkUploadStoped[mock.name]);
                $(".progress-wrp[rel='" + mock.name + "'] .progress-bar").css("background-color", "#d3d3d3");
                $(".progress-wrp[rel='" + mock.name + "'] .status").css("left", "41%").html("<span style='color:#e02d36'>FALHA</span>");
                removeFileForm($(".remove-file-gallery[rel='" + mock.name + "']"), 2000);
                toast("FALHA AO ENVIAR", 6000, "toast-warning");
                $input.siblings(".file_gallery").find(".file-more").removeClass("hide")
            }
        }, error: function (error) {
            clearInterval(checkUploadStoped[mock.name]);
            delete (ajaxUploadProgress[mock.name]);
            delete (checkUploadStoped[mock.name]);
            $(".progress-wrp[rel='" + mock.name + "'] .progress-bar").css("background-color", "#d3d3d3");
            $(".progress-wrp[rel='" + mock.name + "'] .status").css("left", "41%").html("<span style='color:#e02d36'>FALHA</span>");
            removeFileForm($(".remove-file-gallery[rel='" + mock.name + "']"), 2000);
            toast("FALHA AO ENVIAR", 6000, "toast-warning");
            $input.siblings(".file_gallery").find(".file-more").removeClass("hide")
        }, async: !0, data: formData, cache: !1, contentType: !1, processData: !1, timeout: 900000, dataType: "json"
    })
};

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

function createMock(resource, nome, name, extensao, type, size, isImage) {
    if (typeof isImage === "undefined") {
        let reg = new RegExp("^image", "i");
        isImage = reg.test(type)
    }
    let dateNow = new Date();
    let icon = (!isImage && ["doc", "docx", "pdf", "xls", "xlsx", "ppt", "pptx", "zip", "rar", "search", "txt", "json", "js", "iso", "css", "html", "xml", "mp3", "csv", "psd", "mp4", "svg", "avi"].indexOf(extensao) > -1 ? extensao : "file");
    return {
        nome: nome,
        name: name,
        type: extensao,
        fileType: type,
        size: size,
        isImage: isImage,
        icon: icon,
        sizeName: (size > 999999 ? parseFloat(size / 1000000).toFixed(1) + "MB" : (size > 999 ? parseInt(size / 1000) + "KB" : size)),
        url: resource,
        data: zeroEsquerda(dateNow.getHours()) + ":" + zeroEsquerda(dateNow.getMinutes()) + ", " + zeroEsquerda(dateNow.getDay()) + "/" + zeroEsquerda(dateNow.getMonth()) + "/" + dateNow.getFullYear()
    }
}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, {type: mime})
}

function readSubCategories(categoria, subcategorias) {
    db.exeRead("categorias_sub").then(cat => {
        let sub = [];
        for(let i in cat) {
            if(cat[i].categoria == categoria) {
                cat[i].checked = subcategorias.indexOf(cat[i].id.toString()) > -1;
                sub.push(cat[i]);
            }
        }
        if(!isEmpty(sub))
            $("#areasatuacao").removeClass("hide");
        else
            $("#areasatuacao").addClass("hide");

        $("#subcategorias").htmlTemplate('subcategorias', {categorias: sub});
    });
}

function getValoresCampos() {
    let subcategorias = [];
    $(".subcategorias:checked").each(function(i, e) {
        subcategorias.push($(e).attr("id"));
    });

    let dias = [];
    $(".dias").each(function(i, e) {
        if($(e).is(":checked"))
            dias.push($(e).attr("id"));
    });

    return {
        "profissional_id": isNumberPositive(profissional.profissional_id) ? profissional.profissional_id : "",
        "categoria": $("#categoria").val(),
        "subcategorias": subcategorias,
        "sobre": $("#sobre").val(),
        "imagem_de_perfil": imagem_de_perfil,
        "imagem_de_fundo": imagem_de_fundo,
        "galeria": galeria,
        "inicio": $("#inicio").val(),
        "termino": $("#termino").val(),
        "whatsapp": $("#whatsapp").val(),
        "telefone": $("#telefone").val(),
        "email": $("#email").val(),
        "site": $("#site").val(),
        "dias": JSON.stringify(dias),
        "distancia_de_atendimento_km": parseInt($("#distancia").val() || 0),
        "ativo": !0,
    };
}

$(function () {
    profissional = JSON.parse(USER.setorData.perfil_profissional)[0];
    profissional.categoria = parseInt(profissional.categoria);
    profissional.dias = (!isEmpty(profissional.dias) ? JSON.parse(profissional.dias) : []);

    db.exeRead("categorias").then(categorias => {
        $("#categoria").html("");
        if (!isEmpty(categorias)) {
            for (let i in categorias)
                $("#categoria").append("<option value='" + categorias[i].id + "'" + (profissional.categoria === categorias[i].id ? " selected='selected'" : "") + ">" + categorias[i].nome + "</option>");
        }

        readSubCategories(profissional.categoria, profissional.subcategorias || []);
        $("#categoria").off("change").on("change", function() {
            readSubCategories($(this).val(), []);
        });
    });

    imagem_de_perfil = profissional.imagem_de_perfil;
    imagem_de_fundo = profissional.imagem_de_fundo;
    galeria = profissional.galeria || [];

    $("#sobre").val(profissional.sobre);
    $("#imagem_de_perfil_preview").addClass("image").html("<img src='" + profissional.imagem_de_perfil[0].urls.thumb + "' alt='" + USER.nome + "' />");
    $("#imagem_de_fundo_preview").addClass("image").html("<img src='" + profissional.imagem_de_fundo[0].urls.medium + "' alt='" + USER.nome + "' />");
    $("#inicio").val(profissional.inicio);
    $("#termino").val(profissional.termino);
    $("#whatsapp").val(profissional.whatsapp);
    $("#telefone").val(profissional.telefone);
    $("#email").val(profissional.email);
    $("#site").val(profissional.site);
    $("#distancia").val(profissional.distancia_de_atendimento_km);
    for(let dia of profissional.dias)
        $("#" + dia).prop("checked", !0);

    if (!isEmpty(profissional.galeria)) {
        for (let i in profissional.galeria)
            $("#galeria_preview").append("<img src='" + profissional.galeria[i].urls.medium + "' alt='" + USER.nome + "' data-id='"+ i +"' />");
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
                compressImage(file, 1920, 1080, "jpg", function (resource) {
                    var size = parseFloat(4 * Math.ceil(((resource.length - 'data:image/png;base64,'.length) / 3)) * 0.5624896334383812).toFixed(1);
                    let mock = createMock(resource, nome, name, "jpg", "image/" + "jpg", size, !0);

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

    $("#app").off("click", "#galeria_preview>img").on("click", "#galeria_preview>img", function () {
        let id = $(this).data("id");
        if(confirm("remover imagem?")) {
            galeria.splice(id, 1);

            $("#galeria_preview>img").remove();
            for (let i in galeria)
                $("#galeria_preview").append("<img src='" + galeria[i].urls.medium + "' alt='" + USER.nome + "' data-id='"+ i +"' />");
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

    $("#update-profissional").off("click").on("click", function () {
        let p = getValoresCampos();

        if (isEmpty(p.categoria)) {
            toast("informe a categoria", 2000, "toast-warning");
        } else if (isEmpty(p.sobre)) {
            toast("Defina seu Trabalho em Sobre", 2500, "toast-warning");
        } else if (isEmpty(p.whatsapp) || p.whatsapp.length < 10) {
            toast("Informe seu número do Whatsapp com DDD", 2500, "toast-warning");
        } else {

            db.exeCreate("profissional", Object.assign({id: parseInt(USER.setorData.perfil_profissional_id), nome: USER.setorData.nome}, p)).then(r => {
                if (r.db_errorback === 0) {
                    toast("Perfil atualizado!", 1400, "toast-success");
                    delete(r.db_action);
                    delete(r.db_errorback);
                    delete(r.id_old);
                    r.dias = JSON.parse(r.dias);
                    r.imagem_de_perfil = JSON.parse(r.imagem_de_perfil);
                    r.imagem_de_fundo = JSON.parse(r.imagem_de_fundo);
                    USER.setorData.perfil_profissional = JSON.stringify([r]);
                }
            });
        }
    });

});