var chatWriting = !1;

$(function () {
    /**
     * Receive writing information
     */
    sse.add("writing", function (data) {
        console.log(data);
        for(let id in data) {
            if($("#lastonline-" + id).length && $("#blo-" + id).attr("rel") === "0") {
                let dataehora = $("#lastonline-" + id).html();
                $("#lastonline-" + id).html("digitando...").addClass("active");
                clearTimeout(chatWriting);
                chatWriting = setTimeout(function () {
                    $("#lastonline-" + id).html(dataehora).removeClass("active");
                }, 2000);
            }
        }
    });
});