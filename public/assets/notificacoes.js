$(function() {

    db.exeRead("notifications").then(notifications => {
        let myNotifications = [];
        if (!isEmpty(notifications)) {
            for (let i in notifications) {
                if (notifications[i].usuario == USER.id) {
                    notifications[i].calendar = moment(notifications[i].data).calendar().toLowerCase();
                    myNotifications.push(notifications[i]);
                }
            }
        }

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