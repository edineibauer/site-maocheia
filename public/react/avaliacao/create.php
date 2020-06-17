<?php

$read = new \Conn\Read();
$read->exeRead("clientes", "WHERE id =:id", "id={$dados['profissional']}");
if ($read->getResult()) {
    $cliente = $read->getResult()[0];
    if (!empty($cliente['perfil_profissional'])) {
        $profissional = json_decode($cliente['perfil_profissional'], !0)[0];

        /**
         * Notifica profissional
         */
        $note = new \Dashboard\Notification();
        $note->setTitulo($dados['nome_do_cliente'] . " avaliou seu perfil!");
        $note->setDescricao("confira a sua avaliação no app.");
        $note->setImagem($dados['imagem_do_cliente']);
        $note->setUrl(HOME + "cliente/" + $dados['cliente']);
        $note->setUsuarios($dados['cliente']);
        $note->enviar();

        /**
         * Obtém o total de avaliações
         */
        $total = !empty($profissional['total_de_avaliacoes']) ? (int)$profissional['total_de_avaliacoes'] : 0;
        $novoTotal = $total + 1;

        /**
         * Aplica aumento nos Valores avaliados
         */
        $at = ($dados['atendimento'] * 10000000);
        $ql = ($dados['qualidade'] * 10000000);
        $pj = ($dados['preco_justo'] * 10000000);

        /**
         * Atualiza valores de avaliação no profissional
         */
        $profissional['atendimento'] = (!empty($profissional['atendimento']) ? (((((int)$profissional['atendimento']) * $total) + $at) / $novoTotal) : $at);
        $profissional['qualidade'] = (!empty($profissional['qualidade']) ? (((((int)$profissional['qualidade']) * $total) + $ql) / $novoTotal) : $ql);
        $profissional['preco_justo'] = (!empty($profissional['preco_justo']) ? (((((int)$profissional['preco_justo']) * $total) + $pj) / $novoTotal) : $pj);
        $profissional['total_de_avaliacoes'] = $novoTotal;

        /**
         * Envia ao banco as atualizações do profissional
         */
        $up = new \Conn\Update();
        $up->exeUpdate("clientes", ["perfil_profissional" => json_encode([$profissional])], "WHERE id=:id", "id={$dados['profissional']}");
    } else {

    }
}