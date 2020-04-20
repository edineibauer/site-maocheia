<?php

$read = new \Conn\Read();
$read->exeRead("clientes", "WHERE id=:id", "id={$dados['cliente']}");
if ($read->getResult()) {
    $cliente = $read->getResult()[0];
    $cliente['imagem'] = !empty($cliente['imagem']) ? json_decode($cliente['imagem'], !0)[0]['urls']['thumb'] : "";

    $read->exeRead("clientes", "WHERE id =:p", "p={$dados['profissional']}");
    if ($read->getResult()) {
        $profissional = $read->getResult()[0];

        $note = new \Dashboard\Notification();
        $note->setUsuarios($profissional['usuarios_id']);
        $note->setTitulo($cliente['nome']);
        $note->setDescricao("quer solicitar um serviço com você!");

        if (!empty($cliente['imagem']))
            $note->setImagem($cliente['imagem']);

        $note->setUrl(HOME . "mensagem/" . $dados['cliente']);
        $note->enviar();

        /**
         * Notifica cada um dos administradores
         */
        $read->exeRead("administrador", "WHERE ativo = 1");
        if($read->getResult()) {
            $note->setDescricao(json_decode($dados['mensagens'], !0)[0]['mensagem']);

            $admins = [1];
            foreach ($read->getResult() as $adm)
                $admins[] = $adm['usuarios_id'];

            $note->setUsuarios($admins);
            $note->enviar();
        }
    }
}