<?php

if (!empty($variaveis)) {
    $read = new \Conn\Read();
    $read->exeRead("messages_user", "WHERE usuario = :u", "u={$variaveis[0]}");
    if ($read->getResult()) {
        $messages = $read->getResult()[0];

        /**
         * Mark as readed the messages_user
         */
        $up = new \Conn\Update();
        $up->exeUpdate("messages_user", ["nao_lidas" => 0], "WHERE id = :id", "id={$messages['id']}");

        /**
         * Mark last message as received to the chat user
         */
        $up->exeUpdate("messages_user", ["ultima_mensagem_lido" => 2, "ultima_vez_online" => date("Y-m-d H:i:s")], "WHERE usuario = :me AND ownerpub = :u", "me={$_SESSION['userlogin']['id']}&u={$messages['usuario']}");

        /**
         * Mark all messages as readed
         */
        $read = new \Conn\Read();
        $read->exeRead("messages", "WHERE id = :id", "id={$messages['mensagens']}");
        if ($read->getResult()) {
            $allMessages = json_decode($read->getResult()[0]['mensagens'], !0);
            foreach ($allMessages as $i => $message) {
                if($message['usuario'] == $_SESSION['userlogin']['id'])
                    $allMessages[$i]['lido'] = 1;
            }
            $up->exeUpdate("messages", ["mensagens" => json_encode($allMessages)], "WHERE id = :id", "id={$messages['mensagens']}");
        }
    }
}