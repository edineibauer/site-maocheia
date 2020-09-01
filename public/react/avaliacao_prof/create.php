<?php

if (!empty($dados)) {
    $read = new \Conn\Read();
    $read->exeRead("clientes", "WHERE id =:id", "id={$dados['profissional']}");
    if ($read->getResult()) {
        $cliente = $read->getResult()[0];
        if (!empty($cliente['perfil_profissional'])) {
            $profissional = json_decode($cliente['perfil_profissional'], !0)[0];

            /**
             * Obtém o total de avaliações
             */
            $total = !empty($profissional['total_de_avaliacoes']) ? (int)$profissional['total_de_avaliacoes'] : 0;
            $novoTotal = $total + 1;

            /**
             * Aplica aumento nos Valores avaliados
             */
            $at = $dados['atendimento'];
            $ql = $dados['qualidade'];
            $pj = $dados['preco_justo'];

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
        }
    }
}