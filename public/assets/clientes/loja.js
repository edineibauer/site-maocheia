$(document).ready(function() {
    $('#galeria .owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        autoplay: true,
        responsive: {
            0: {
                items: 2
            },
            600: {
                items: 4
            },
            1000: {
                items: 6
            }
        }
    });
    $('#clientes .owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        autoplay: true,
        responsive: {
            0: {
                items: 2
            },
            600: {
                items: 4
            },
            1000: {
                items: 8
            }
        }
    })

    //https://maocheia.ag3tecnologia.com.br/app/get/estabelecimentos
    function setCarrregado() {
        $("#carregando").hide();
        $("#perfil-loja").show();

    }

    function setCarregando() {
        $("#carregando").show();
        $("#perfil-loja").hide();
    }

    function setProfissionalForm(estabelecimentos) {
        $("#texto").text(estabelecimentos.sobre);
        var enderecos = JSON.parse(estabelecimentos.endereco);
        $("#endereco").val(enderecos[0].rua);
        $("#imagem").prop("src", estabelecimentos);
    }

    setCarregando();

    $(document).ready(function() {

        db.exeRead("estabelecimentos", FRONT.VARIAVEIS[0]).then(loja => {
            if(!isEmpty(loja)) {
                console.log(loja);
            }
        });

        const url = "https://maocheia.ag3tecnologia.com.br/app/get/find/estabelecimentos";
        const urlFinal = `${url}`
        $.ajax({
            type: 'GET',
            url: urlFinal,
            success: function(data) {
                const [estabelecimentos] = data.estabelecimentos
                setProfissionalForm(estabelecimentos);
                setCarrregado();
            }
        });
    })
});