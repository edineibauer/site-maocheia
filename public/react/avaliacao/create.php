<?php

$read = new \Conn\Read();
$read->exeRead("profissional", "WHERE id =:id", "id={$dados['profissional']}");
if($read->getResult()) {
    $profissional = $read->getResult()[0];

    /**
     * Obtém o total de avaliações
     */
    $total = !empty($profissional['total_de_avaliacoes']) ? (int) $profissional['total_de_avaliacoes'] : 0;
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
    $profissional['qualidade'] = (!empty($profissional['atendimento']) ? (((((int)$profissional['qualidade']) * $total) + $ql) / $novoTotal) : $ql);
    $profissional['preco_justo'] = (!empty($profissional['atendimento']) ? (((((int)$profissional['preco_justo']) * $total) + $pj) / $novoTotal) : $pj);
    $profissional['total_de_avaliacoes'] = $novoTotal;

    /**
     * Envia ao banco as atualizações do profissional
     */
    $up = new \Conn\Update();
    $up->exeUpdate("profissional", $profissional, "WHERE id=:id", "id={$dados['profissional']}");
}