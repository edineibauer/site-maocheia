async function closeHistory(id) {
    let $note = $(".notification-item[rel='" + id + "']");
    $note.addClass("activeRemove");
    setTimeout(function () {
        $note.remove()
    }, 150);
    await db.exeDelete("historico", id);
}