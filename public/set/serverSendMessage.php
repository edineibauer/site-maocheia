<?php

use Conn\Create;
use Conn\Read;
use Conn\Update;

/**
 * Send the message to database
 * @param int $user
 * @param string $msg
 */
function addMessageToMysql(int $user, string $msg)
{
    $mensagem = [
        "mensagem" => $msg,
        "usuario" => $user,
        "data" => date("Y-m-d H:i:s"),
        "anexos" => null
    ];

    $read = new Read();
    $read->exeRead("messages_user", "WHERE usuario = :id", "id={$user}");
    if($read->getResult()) {
        //update

        /**
         * Find message data dialog
         */
        $read->exeRead("messages", "WHERE id = :idm", "idm={$read->getResult()[0]['mensagem']}");
        if($read->getResult()) {

            /**
             * Update message data diaolog
             */
            $messages = json_decode($read->getResult()[0]['messages'], !0);
            $messages[] = $mensagem;

            /**
             * Update mysql with new message data dialog
             */
            $up = new Update();
            $up->exeUpdate("messages", ['messages' => json_encode($messages)], "WHERE id = :ui", "ui={$read->getResult()[0]['id']}");
        }

    } else {
        //create
        $create = new Create();

        /**
         * Create message data dialog
         */
        $create->exeCreate("messages", ['messages' => json_encode([$mensagem])]);
        if($create->getResult()) {

            /**
             * Create personal user message track with the message data dialog
             */
            $create->exeCreate("messages_user", [
                "usuario" => $user,
                "ownerpub" => $_SESSION['userlogin']['id'],
                "mensagem" => $create->getResult()
            ]);

            /**
             * Create personal user message track with the message data dialog to the user target
             */
            $create->exeCreate("messages_user", [
                "usuario" => $_SESSION['userlogin']['id'],
                "ownerpub" => $user,
                "mensagem" => $create->getResult()
            ]);
        }
    }
}

$user = filter_input(INPUT_POST, 'usuario', FILTER_VALIDATE_INT);
$mensagem = trim(strip_tags(filter_input(INPUT_POST, 'mensagem', FILTER_DEFAULT)));

addMessageToMysql($user, $mensagem);