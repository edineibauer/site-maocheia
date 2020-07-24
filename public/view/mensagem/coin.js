

$(function () {
    (async () => {
        let havePermissionChat = await AJAX.get("event/messagePermission/" + history.state.param.url[0]);
        console.log(havePermissionChat);
        if(isEmpty(USER.setorData.perfil_profissional) || havePermissionChat) {
            $(".message-input").css("display", "block");
        } else {

            let tpl = await getTemplates();
            $("#frame").append(Mustache.render(tpl.coin));

            $("#app").off("click", ".btn-buy").on("click", ".btn-buy", function () {
                $(".message-input").css("display", "block");
                $(".message-input-buy").remove();
                AJAX.post("openMessage", {id: history.state.param.url[0]});
            });
        }
    })();
});
