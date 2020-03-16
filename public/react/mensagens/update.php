<?php

$read = new \Conn\Read();

if ($dados['aceitou'] == 1 || $_SESSION['userlogin']['setor'] === "clientes") {

    if ($_SESSION['userlogin']['setor'] === "clientes") {
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

    } elseif ($_SESSION['userlogin']['setor'] === "profissional") {

        $read->exeRead("clientes", "WHERE id=:id", "id={$dados['cliente']}");
        if ($read->getResult()) {
            $cliente = $read->getResult()[0];

            $read->exeRead("profissional", "WHERE id =:p", "p={$dados['profissional']}");
            if ($read->getResult()) {
                $profissional = $read->getResult()[0];
                $profissional['imagem'] = !empty($profissional['imagem_de_perfil']) ? json_decode($profissional['imagem_de_perfil'], !0)[0]['urls'][100] : "";
                $mensagens = json_decode($dados['mensagens'], !0);

                $read->exeRead("notifications", "WHERE usuario = :u && url = '" . HOME . "mensagem/" . $dados['profissional'] . "'", "u={$cliente['usuarios_id']}");
                if (!$read->getResult()) {

                    $note = new \Dashboard\Notification();
                    $note->setUsuario($cliente['usuarios_id']);
                    $note->setTitulo($profissional['nome']);
                    $note->setDescricao($mensagens[count($mensagens) - 1]['mensagem']);

                    if (!empty($profissional['imagem']))
                        $note->setImagem($profissional['imagem']);

                    $note->setUrl(HOME . "mensagem/" . $dados['profissional']);
                    $note->enviar();
                }
            }
        }
    }
}