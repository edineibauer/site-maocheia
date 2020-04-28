$(function () {
    db.exeRead("ajuda").then(ajuda => {
        if(!isEmpty(ajuda)) {
            $("#ajudas").htmlTemplate('ajudas', {ajudas: ajuda})
        } else {
            $("#ajudas").htmlTemplate('notificacoesEmpty');
        }
    });
});