async function chatUser() {
    $(".message-input").removeClass("hide");
    $(".message-input-buy").remove();
    let result = await AJAX.post("openMessage", {id: URL[0]});

    if (result === 1) {
        history.state.param.aceito = 1;
        history.replaceState(history.state, null, HOME + (HOME === "" && HOME !== SERVER ? "index.html?url=" : "") + app.route);
    }
}