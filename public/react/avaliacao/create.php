<?php

$read = new \Conn\Read();
$read->exeRead("profissional", "WHERE id =:id", "id={$dados['profissional']}");
if($read->getResult()) {
    $profissional = $read->getResult()[0];

    /**
     * decode json values to not crash on save encode cliente data
     */
    $profissional['subcategorias'] = !empty($profissional['subcategorias']) ? json_decode($profissional['subcategorias'], !0) : null;
    $profissional['imagem_de_perfil'] = !empty($profissional['imagem_de_perfil']) ? json_decode($profissional['imagem_de_perfil'], !0) : null;
    $profissional['imagem_de_fundo'] = !empty($profissional['imagem_de_fundo']) ? json_decode($profissional['imagem_de_fundo'], !0) : null;
    $profissional['cartao_de_credito'] = !empty($profissional['cartao_de_credito']) ? json_decode($profissional['cartao_de_credito'], !0) : null;
    $profissional['galeria'] = !empty($profissional['galeria']) ? json_decode($profissional['galeria'], !0) : null;
    $profissional['dias'] = !empty($profissional['dias']) ? json_decode($profissional['dias'], !0) : null;

    $total = !empty($profissional['total_de_avaliacoes']) ? (int) $profissional['total_de_avaliacoes'] : 0;
    $novoTotal = $total + 1;

    $at = ($dados['atendimento'] * 10000000);
    $ql = ($dados['qualidade'] * 10000000);
    $pj = ($dados['preco_justo'] * 10000000);
    $profissional['atendimento'] = (!empty($profissional['atendimento']) ? (((((int)$profissional['atendimento']) * $total) + $at) / $novoTotal) : $at);
    $profissional['qualidade'] = (!empty($profissional['atendimento']) ? (((((int)$profissional['qualidade']) * $total) + $ql) / $novoTotal) : $ql);
    $profissional['preco_justo'] = (!empty($profissional['atendimento']) ? (((((int)$profissional['preco_justo']) * $total) + $pj) / $novoTotal) : $pj);
    $profissional['total_de_avaliacoes'] = $novoTotal;

    $up = new \Conn\Update();
    $up->exeUpdate("clientes", ["perfil_profissional" => json_encode([$profissional])], "WHERE perfil_profissional_id =:id", "id={$dados['profissional']}");
}