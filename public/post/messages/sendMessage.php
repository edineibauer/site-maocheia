<?php

$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
$mensagem = filter_input(INPUT_POST, 'mensagem', FILTER_DEFAULT);
$usuario = filter_input(INPUT_POST, 'usuario', FILTER_VALIDATE_INT);

$read = new \Conn\Read();
$read->exeRead("messages_user", "WHERE usuario = :u", "u={$usuario}");

/**
 * Se não tiver o chat ainda ou se já tiver aceito
 */
if(!$read->getResult() || $read->getResult()[0]['aceito'] == 1) {
    $read->exeRead("messages", "WHERE id = :id", "id={$id}");
    if ($read->getResult()) {
        $allMessages = json_decode($read->getResult()[0]['mensagens'], !0);
        $allMessages[] = json_decode($mensagem, !0);
        $up = new \Conn\Update();
        $up->exeUpdate("messages", ["mensagens" => json_encode($allMessages)], "WHERE id = :id", "id={$id}");
    }
}