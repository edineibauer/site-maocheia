$(function () {
    if (Notification.permission !== "default")
        $(".btn-notify").remove();

    (async () => {
        let myNotifications = await getNotifications();
        if (isEmpty(myNotifications)) {
            $("#notificacoes").htmlTemplate('notificacoesEmpty');
        } else {
            $("#notificacoes").htmlTemplate('note', {notificacoes: myNotifications});
        }
    })();
});