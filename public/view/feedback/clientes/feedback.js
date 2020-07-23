$(function() {
    $("#feed").on("click", function(e) {
        e.preventDefault();
        let m = $.trim($('#feedback').val());

        if(m.length > 5) {
            db.exeCreate("feedback", {descricao: $('#feedback').val()});
            toast("Obrigado pelo seu Feedback!", 2500, "toast-success");
            history.back();
        } else {
            toast("Sua mensagem é muito curta", 1500, "toast-warning");
        }
    });
});