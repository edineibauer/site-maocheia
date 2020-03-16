<?php

$read = new \Conn\Read();
$up = new \Conn\Update();

/**
 * Verifica compra do contato
 */
if($dadosOld['aceitou'] == 0 && $dados['aceitou'] == 1) {
    $read->exeRead("profissional", "WHERE id = :id && ativo = 1", "id={$_SESSION['userlogin']['setorData']['id']}");
    if($read->getResult()) {
        $prof = $read->getResult()[0];
        if(!empty($prof['moedas']) && is_numeric($prof['moedas']) && $prof['moedas'] > 1) {
            $up->exeUpdate("profissional", ["moedas" => ($prof['moedas'] - 1)], "WHERE id = :id", "id={$_SESSION['userlogin']['setorData']['id']}");
        } else {

            /**
             * Retorna o comando de aceite para negado pois invalidou a compra
             */
            $up->exeUpdate("mensagens", ["aceitou" => 0], "WHERE id = :id", "id={$dados['id']}");
        }
    } else {
        /**
         * Retorna o comando de aceite para negado pois invalidou a compra
         */
        $up->exeUpdate("mensagens", ["aceitou" => 0], "WHERE id = :id", "id={$dados['id']}");
    }

} elseif($dados['aceitou'] == 1 || $_SESSION['userlogin']['setor'] === "clientes") {

    $read->exeRead("clientes", "WHERE id=:id", "id={$dados['cliente']}");
    if ($read->getResult()) {
        $cliente = $read->getResult()[0];
        $cliente['imagem'] = !empty($cliente['imagem']) ? json_decode($cliente['imagem'], !0)[0]['urls'][100] : "";

        $read->exeRead("profissional", "WHERE id =:p", "p={$dados['profissional']}");
        if ($read->getResult()) {
            $profissional = $read->getResult()[0];
            $mensagens = json_decode($dados['mensagens'], !0);

            $read->exeRead("notifications", "WHERE usuario = :u && url = '" . HOME . "mensagem/" . $dados['cliente'] . "'", "u={$profissional['usuarios_id']}");
            if (!$read->getResult()) {

                $note = new \Dashboard\Notification();
                $note->setUsuario($profissional['usuarios_id']);
                $note->setTitulo($cliente['nome']);
                $note->setDescricao($mensagens[count($mensagens) - 1]['mensagem']);

                if (!empty($cliente['imagem']))
                    $note->setImagem($cliente['imagem']);

                $note->setUrl(HOME . "mensagem/" . $dados['cliente']);
                $note->enviar();
            }
        }
    }
}