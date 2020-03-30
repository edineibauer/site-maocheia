<?php

$read = new \Conn\Read();

$mensagens = json_decode($dados['mensagens'], !0);
$mensagem = $mensagens[count($mensagens) - 1];

$remetente = ($mensagem['enviada_pelo_cliente'] ? $dados['cliente'] : $dados['profissional']);
$destinatario = ($mensagem['enviada_pelo_cliente'] ? $dados['profissional'] : $dados['cliente']);

$read->exeRead("clientes", "WHERE id=:id", "id={$remetente}");
if ($read->getResult()) {
    $remetente = $read->getResult()[0];
    $remetente['imagem'] = !empty($remetente['imagem']) ? json_decode($remetente['imagem'], !0)[0]['urls'][100] : "";

    $read->exeRead("clientes", "WHERE id =:p", "p={$destinatario}");
    if ($read->getResult()) {
        $destinatario = $read->getResult()[0];

        $read->exeRead("notifications", "WHERE usuario = :u && url = '" . HOME . "mensagem/" . $remetente['id'] . "'", "u={$destinatario['usuarios_id']}");
        if (!$read->getResult()) {

            $note = new \Dashboard\Notification();
            $note->setUsuario($destinatario['usuarios_id']);
            $note->setTitulo($remetente['nome']);

            if($dados['aceitou'])
                $note->setDescricao($mensagem['mensagem']);
            else
                $note->setDescricao($remetente['nome'] . " entrou em contato novamente solicitando um serviço com você!");

            if (!empty($remetente['imagem']))
                $note->setImagem($remetente['imagem']);

            $note->setUrl(HOME . "mensagem/" . $remetente['id']);
            $note->enviar();
        }
    }
}