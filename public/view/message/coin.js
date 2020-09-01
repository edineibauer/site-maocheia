function chatUser() {
    $(".message-input").removeClass("hide");
    $(".message-input-buy").remove();
    AJAX.post("openMessage", {id: URL[0]});
}