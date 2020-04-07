var imagem_de_perfil = [], imagem_de_fundo = [], galeria = [];

var Upload = function (file) {
    this.file = file
};
var checkUploadStoped = {};
var ajaxUploadProgress = {};
Upload.prototype.exeUpload = function (mock, $input, funcao) {
    var that = this;
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

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, {type: mime})
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