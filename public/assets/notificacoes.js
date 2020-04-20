$(function () {
    if (Notification.permission !== "default")
        $(".btn-notify").remove();

    db.exeRead("notifications_report").then(notifications => {
        let myNotifications = [];
        let promessas = [];
        if (!isEmpty(notifications)) {
            for (let i in notifications) {
                if (notifications[i].usuario == USER.id) {
                    promessas.push(db.exeRead("notifications", notifications[i].notificacao).then(notify => {
                        notify.data = moment(notifications[i].data_de_envio).calendar().toLowerCase();
                        notifications[i].notificacaoData = notify;
                        myNotifications.push(notifications[i]);
                    }));
                }
            }
        }

        Promise.all(promessas).then(() => {
            if (isEmpty(myNotifications)) {
                $("#notificacoes").htmlTemplate('notificacoesEmpty');
            } else {
                $("#notificacoes").htmlTemplate('cardsNotificacoes', {notificacoes: myNotifications}).then(() => {
                    $(".notification-card").off("click").on("click", function () {
                        let href = $(this).data("href");
                        let id = parseInt($(this).attr("rel"));
                        db.exeDelete("notifications", id);
                        pageTransition(href);
                    });
                });
            }
        });
    });
});