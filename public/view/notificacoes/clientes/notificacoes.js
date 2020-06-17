$(function () {
    if (Notification.permission !== "default")
        $(".btn-notify").remove();

    (async () => {
        let myNotifications = await getNotifications();
        if (isEmpty(myNotifications)) {
            $("#notificacoes").htmlTemplate('notificacoesEmpty', {mensagem: "Você não tem nenhuma notificação"});
        } else {
            $("#notificacoes").htmlTemplate('note', {notificacoes: myNotifications});
        }
    })();
});