function setCarrregado() {
    $("#carregando").hide();
    $("#formProfissional").show();

}

function setCarregando() {
    $("#carregando").show();
    $("#formProfissional").hide();
}

function setProfissionalForm(profissional) {
    $("#nome").val(profissional.nome);
    $("#email").val(profissional.email);
    $("#telefone").val(profissional.telefone);
    $("#titulo").text(profissional.nome);
    $("#senha").val(profissional.senha);
    var enderecos = JSON.parse(profissional.endereco);
    $("#endereco").val(enderecos[0].rua);

}


function getId() {
    let searchParams = new URLSearchParams(window.location.search);
    console.log("search: ", searchParams);
    return searchParams.has('id') ? searchParams.get('id') : '';
}

setCarregando();


$(function() {

    $(".sair-app").off("click").on("click", function () {
        logoutDashboard();
    });

    const url = "https://maocheia.ag3tecnologia.com.br/app/find/profissional/id=1";
    const id = getId();
    const urlFinal = `${url}/${id}`
    $.ajax({
        type: 'GET',
        url: urlFinal,
        success: function(data) {

            const [profissional] = data.profissional

            setProfissionalForm(profissional);

            setCarrregado();
        }
    });
})