$(function () {
    if (Notification.permission !== "default")
        $(".btn-notify").remove();

    (async () => {
        let myHistorico = await get("event/historico");
        if (isEmpty(myHistorico)) {
            $("#notificacoes").htmlTemplate('notificacoesEmpty');
        } else {
            for(let historico of myHistorico) {
                historico.imagem = (!isEmpty(historico.imagem) ? JSON.parse(historico.imagem)[0] : "");
                historico.data = moment(historico.data).calendar().toLowerCase();
            }
            $("#notificacoes").htmlTemplate('historico', myHistorico);
        }
    })();
});