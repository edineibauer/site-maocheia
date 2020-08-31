<?php

if (!empty($dadosOld) && !empty($dados)) {
    $messageOldCount = count(json_decode($dadosOld['mensagens'], !0));
    $allMessages = json_decode($dados['mensagens'], !0);

    if ($messageOldCount !== count($allMessages)) {

        $read = new \Conn\Read();
        $read->exeRead("messages_user", "WHERE mensagens = :id AND usuario = :user", "id={$dados['id']}&user={$_SESSION['userlogin']['id']}", !0);
        if ($read->getResult()) {
            $messages = $read->getResult()[0];
            $lastMessage = $allMessages[count($allMessages) - 1];
            $up = new \Conn\Update();

            /**
             * Update my last message
             */
            $up->exeUpdate("messages_user", [
                "ultima_mensagem" => $lastMessage['mensagem'],
                "data_ultima_mensagem" => $lastMessage['data'],
                "ultima_mensagem_lido" => 1,
                "recebido" => 1
            ], "WHERE mensagens = :id AND ownerpub = :user", "id={$dados['id']}&user={$_SESSION['userlogin']['id']}");

            /**
             * Check if the user is bloqued
             */
            if ($messages['bloqueado'] != 1) {

                /**
                 * Check if user need to receive the push (if is offline on app)
                 */
                $dia = date("Y-m-d");
                $isUserOffline = !file_exists(PATH_HOME . "_cdn/userActivity/" . $messages['ownerpub'] . "/{$dia}.json");
                if (!$isUserOffline) {
                    $day = json_decode(file_get_contents(PATH_HOME . "_cdn/userActivity/" . $messages['ownerpub'] . "/{$dia}.json"), !0);
                    $isUserOffline = (strtotime($dia . ' ' . $day[count($day) - 1]) < strtotime('now') - 10);
                }

                $userView = "";
                if(file_exists(PATH_HOME . "_cdn/userLastView/" . $messages['ownerpub'] . ".txt"))
                    $userView = file_get_contents(PATH_HOME . "_cdn/userLastView/" .$messages['ownerpub'] . ".txt");

                /**
                 * Update user chat last message
                 */
                $up->exeUpdate("messages_user", [
                    "nao_lidas" => (empty($messages['nao_lidas']) ? 1 : ($messages['nao_lidas'] + 1)),
                    "ultima_mensagem" => $lastMessage['mensagem'],
                    "data_ultima_mensagem" => $lastMessage['data'],
                    "ultima_mensagem_lido" => 0,
                    "recebido" => $userView !== "messages" && $userView !== "message" && $messages['silenciado'] == 0 ? 0 : 1
                ], "WHERE id = :idm", "idm={$messages['id']}");

                /**
                 * Notify the user
                 */
                if ($messages['silenciado'] == 0) {

                    /**
                     * User is not silence and not online
                     * so send notification
                     */
                    if ($isUserOffline)
                        \Dashboard\Notification::create($_SESSION['userlogin']['nome'], $lastMessage['mensagem'], $messages['ownerpub']);
                }
            }
        }
    }
}