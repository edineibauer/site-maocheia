<?php

$profissional = $dados;

/**
 * decode json values to not crash on save encode cliente data
 */
$profissional['subcategorias'] = !empty($profissional['subcategorias']) ? json_decode($profissional['subcategorias'], !0) : null;
$profissional['imagem_de_perfil'] = !empty($profissional['imagem_de_perfil']) ? json_decode($profissional['imagem_de_perfil'], !0) : null;
$profissional['imagem_de_fundo'] = !empty($profissional['imagem_de_fundo']) ? json_decode($profissional['imagem_de_fundo'], !0) : null;
$profissional['cartao_de_credito'] = !empty($profissional['cartao_de_credito']) ? json_decode($profissional['cartao_de_credito'], !0) : null;
$profissional['galeria'] = !empty($profissional['galeria']) ? json_decode($profissional['galeria'], !0) : null;
$profissional['dias'] = !empty($profissional['dias']) ? json_decode($profissional['dias'], !0) : null;

/**
 * Valores padrões para criação do campo de relação
 */
$profissional['id'] = strtotime('now') . rand(0, 100000);
$profissional['formIdentificador'] = strtotime('now') . rand(0, 100000);
$profissional['columnTituloExtend'] = "";
$profissional['columnName'] = "perfil_profissional";
$profissional['columnRelation'] = "profissional";
$profissional['columnStatus'] = json_encode(["column" => "", "have" => false, "value" => false]);

$up = new \Conn\Update();
$up->exeUpdate("clientes", ["perfil_profissional" => json_encode([$profissional])], "WHERE perfil_profissional_id =:id", "id={$dados['id']}");
