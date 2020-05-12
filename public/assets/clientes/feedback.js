$(function() {
    $("#feed").on("click", function(e) {
        e.preventDefault();

        const mensagem = $('textarea[name="feedback-teste"]').val();
        $.ajax({
            url: "https://maocheia.ag3tecnologia.com.br/app/put/feedback",
            key: '9fdd61be642501ac434acded4315adc6',
            type: 'POST',
            data: mensagem,
            success: function(result) {
                $("#resultado").html("<strong>Sucesso!</strong>");
            },
            error: function() {
                console.log("deu errado");
            }
        });
    });
});