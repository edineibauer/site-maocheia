$(function () {
    if (Notification.permission !== "default")
        $(".btn-notify").remove();

    (async () => {
        let myNotifications = await getNotifications();
        if (isEmpty(myNotifications)) {
            $("#notificacoes").htmlTemplate('notificacoesEmpty');
        } else {
            console.log(myNotifications);
            $("#notificacoes").htmlTemplate('note', {notificacoes: myNotifications});
        }
    })();
});