<?php

$data['data'] = [];
$sql = new \Conn\SqlCommand();
$sql->exeCommand("SELECT c.nome, c.id, c.imagem, c.perfil_profissional, c.usuarios_id, mu.bloqueado, mu.silenciado, mu.data_ultima_mensagem, mu.ultima_mensagem, mu.recebido, mu.nao_lidas FROM " . PRE . "messages_user as mu JOIN " . PRE . "clientes as c ON c.usuarios_id = mu.usuario WHERE mu.ownerpub = {$_SESSION['userlogin']['id']}", !0);
if($sql->getResult()) {
    foreach ($sql->getResult() as $item) {
        $item['perfil_profissional'] = !empty($item['perfil_profissional']) ? json_decode($item['perfil_profissional'], !0) : [];
        $item['imagem'] = (!empty($item['perfil_profissional']) && !empty($item['perfil_profissional']['imagem_de_perfil']) ? $item['perfil_profissional']['imagem_de_perfil'][0]['urls']['thumb'] : (!empty($item['imagem']) ? json_decode($item['imagem'], !0)[0]['urls']['thumb'] : HOME . "public/assets/svg/account.svg"));
        $item['nao_lidas'] = (int) $item['nao_lidas'];
        $item['recebido'] = (int) $item['recebido'];
        $item['bloqueado'] = (int) $item['bloqueado'];
        $item['silenciado'] = (int) $item['silenciado'];
        $item['isPendente'] = $item['nao_lidas'] > 0;
        $item['data_ultima_mensagem'] = (date("Y-m-d", strtotime($item['data_ultima_mensagem'])) === date("Y-m-d") ? "Hoje as " . date("H:i", strtotime($item['data_ultima_mensagem'])) : date("d/m/Y H:i", strtotime($item['data_ultima_mensagem'])));

        /**
         *  Get status online
         */
        $item['isOnline'] = file_exists(PATH_HOME . "_cdn/userActivity/" . $item['usuarios_id'] . "/isOnline.json");
        $item['isWriting'] = file_exists(PATH_HOME . "_cdn/chat/" . $_SESSION['userlogin']['id'] . "/" . $item['usuarios_id'] . ".txt");

        $data['data'][] = $item;
    }
}