<?php

$read = new \Conn\Read();
$read->exeRead("clientes", "WHERE id=:id", "id={$dados['cliente']}");
if ($read->getResult()) {
    $cliente = $read->getResult()[0];
    $cliente['imagem'] = !empty($cliente['imagem']) ? json_decode($cliente['imagem'], !0)[0]['urls'][100] : "";

    $read->exeRead("profissional", "WHERE id =:p", "p={$dados['profissional']}");
    if ($read->getResult()) {
        $profissional = $read->getResult()[0];

        $note = new \Dashboard\Notification();
        $note->setUsuario($profissional['usuarios_id']);
        $note->setTitulo($cliente['nome']);
        $note->setDescricao(json_decode($dados['mensagens'], !0)[0]['mensagem']);

        if (!empty($cliente['imagem']))
            $note->setImagem($cliente['imagem']);

        $note->setUrl(HOME . "mensagem/" . $dados['cliente']);
        $note->enviar();
    }
}