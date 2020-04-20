<?php

$read = new \Conn\Read();

$mensagens = json_decode($dados['mensagens'], !0);
$mensagem = $mensagens[count($mensagens) - 1];

$remetente = ($mensagem['enviada_pelo_cliente'] ? $dados['cliente'] : $dados['profissional']);
$destinatario = ($mensagem['enviada_pelo_cliente'] ? $dados['profissional'] : $dados['cliente']);

$read->exeRead("clientes", "WHERE id=:id", "id={$remetente}");
if ($read->getResult()) {
    $remetente = $read->getResult()[0];
    $remetente['imagem'] = !empty($remetente['imagem']) ? json_decode($remetente['imagem'], !0)[0]['urls']['thumb'] : "";

    $read->exeRead("clientes", "WHERE id =:p", "p={$destinatario}");
    if ($read->getResult()) {
        $destinatario = $read->getResult()[0];

        $note = new \Dashboard\Notification();
        $note->setUsuarios($destinatario['usuarios_id']);
        $note->setTitulo($remetente['nome']);

        if($dados['aceitou'])
            $note->setDescricao($mensagem['mensagem']);
        else
            $note->setDescricao("enviou uma mensagem para você");

        if (!empty($remetente['imagem']))
            $note->setImagem($remetente['imagem']);

        $note->setUrl(HOME . "mensagem/" . $remetente['id']);
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