async function closeHistory(id) {
    let $note = $(".notification-item[rel='" + id + "']");
    $note.addClass("activeRemove");
    setTimeout(function () {
        $note.remove()
    }, 150);
    await db.exeDelete("historico", id);
}

$(function () {
    if (Notification.permission !== "default")
        $(".btn-notify").remove();

    (async () => {
        let myHistorico = await get("event/historico");
        if (isEmpty(myHistorico)) {
            $("#notificacoes").htmlTemplate('notificacoesEmpty', {mensagem: "Você não possui histórico"});
        } else {
            for(let historico of myHistorico) {
                historico.imagem = (!isEmpty(historico.perfil_profissional) && !isEmpty(historico.perfil_profissional.imagem_de_perfil) ? historico.perfil_profissional.imagem_de_perfil[0] : (!isEmpty(historico.imagem) ? JSON.parse(historico.imagem)[0] : ""));
                historico.data = moment(historico.data).calendar().toLowerCase();
            }
            $("#notificacoes").htmlTemplate('historico', myHistorico);
        }
    })();
});