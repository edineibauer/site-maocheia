$(function () {
    (async () => {
        let minhaMensagem = await exeRead("messages_user", {"usuario": history.state.param.url[0]});
        let tpl = await getTemplates();
        if(isEmpty(minhaMensagem[0].mensagem)) {
            $("#frame").append(Mustache.render(tpl.coin));
        } else {
            $(".message-input").css("display", "block");
        }

        $("#app").off("click", ".btn-buy").on("click", ".btn-buy", function () {
            $(".message-input").css("display", "block");
            $(".message-input-buy").remove();
            AJAX.post("openMessage", {id: history.state.param.url[0]}).then(r => {
                console.log(r);
                if(r === 1) {
                    USER.setorData.moeda--;
                }
            });
        });
    })();
});
