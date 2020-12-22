<?php

$data['data'] = [];
if(!empty($variaveis[0])) {
    $sql = new \Conn\SqlCommand();
    $sql->exeCommand("SELECT c.nome, c.imagem, c.perfil_profissional, c.usuarios_id, m.id as mensagem_id, m.mensagens, mu.id, mu.bloqueado, mu.silenciado, mu.data_ultima_mensagem FROM " . PRE . "messages_user as mu JOIN " . PRE . "clientes as c ON c.usuarios_id = mu.usuario JOIN " . PRE . "messages as m ON m.id = mu.mensagens WHERE mu.ownerpub = {$_SESSION['userlogin']['id']} AND mu.usuario = {$variaveis[0]}", !0);
    if($sql->getResult()) {
        $item = $sql->getResult()[0];
        $item['perfil_profissional'] = !empty($item['perfil_profissional']) ? json_decode($item['perfil_profissional'], !0) : [];
        $item['imagem'] = (!empty($item['perfil_profissional']) && !empty($item['perfil_profissional']['imagem_de_perfil']) ? $item['perfil_profissional']['imagem_de_perfil'][0]['urls']['thumb'] : (!empty($item['imagem']) ? json_decode($item['imagem'], !0)[0]['urls']['thumb'] : HOME . "public/assets/svg/account.svg"));
        $item['bloqueado'] = (int) $item['bloqueado'];
        $item['silenciado'] = (int) $item['silenciado'];
        $item['data_ultima_mensagem'] = (date("Y-m-d", strtotime($item['data_ultima_mensagem'])) === date("Y-m-d") ? "Hoje as " . date("H:i", strtotime($item['data_ultima_mensagem'])) : date("d/m/Y H:i", strtotime($item['data_ultima_mensagem'])));

        $item['mensagens'] = !empty($item['mensagens']) ? json_decode($item['mensagens'], !0) : [];
        $havePendent = false;
        foreach ($item['mensagens'] as $i => $mensagen) {
            $item['mensagens'][$i]['isPendent'] = !1;

            if($mensagen['usuario'] == $_SESSION['userlogin']['id'] && $mensagen['lido'] == 0) {
                $item['mensagens'][$i]['isPendent'] = !0;
                $item['mensagens'][$i]['lido'] = 1;
                $havePendent = true;
            }
        }

        /**
         * Update recebido
         */
        $up = new \Conn\Update();
        $up->exeUpdate("messages_user", ["recebido" => 1], "WHERE ownerpub = {$variaveis[0]} AND usuario = {$_SESSION['userlogin']['id']} AND recebido = 0");
        $up->exeUpdate("messages_user", ["nao_lidas" => 0], "WHERE ownerpub = {$_SESSION['userlogin']['id']} AND usuario = {$variaveis[0]} AND nao_lidas > 0");

        /**
         * Update recebido in all messages
         */
        if($havePendent)
            $up->exeUpdate("messages", ["mensagens" => json_encode($item['mensagens'])], "WHERE id = {$item['mensagem_id']}");

        $data['data'] = $item;
    } else {

        $read = new \Conn\Read();
        $read->exeRead("clientes", "WHERE usuarios_id =:id", "id={$variaveis[0]}");
        if($read->getResult()) {

            $item = $read->getResult()[0];
            $item['mensagens'] = [];
            $item['perfil_profissional'] = !empty($item['perfil_profissional']) ? json_decode($item['perfil_profissional'], !0) : [];
            $item['imagem'] = (!empty($item['perfil_profissional']) && !empty($item['perfil_profissional']['imagem_de_perfil']) ? $item['perfil_profissional']['imagem_de_perfil'][0]['urls']['thumb'] : (!empty($item['imagem']) ? json_decode($item['imagem'], !0)[0]['urls']['thumb'] : HOME . "public/assets/svg/account.svg"));
            $item['bloqueado'] = 0;
            $item['silenciado'] = 0;
            $item['data_ultima_mensagem'] = date("H:i");

            $data['data'] = $item;
        }
    }
}