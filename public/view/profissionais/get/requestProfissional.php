<?php

$read = new \Conn\Read();

$data['data']['profissionais'] = [];
$data['data']['profissionaisTodo'] = [];
$data['data']['haveProfissionais'] = !empty($data['data']['profissionais']);

$read->exeRead("clientes", "WHERE perfil_profissional IS NOT NULL AND ativo = 1 ORDER BY qualidade,preco_justo DESC LIMIT 60");
if($read->getResult()) {
    foreach ($read->getResult() as $item) {
        $item['perfil_profissional'] = json_decode($item['perfil_profissional'], !0);
        $item['qualidade'] = empty($item['qualidade']) ? 3 : ($item['qualidade'] / 10000000);
        $item['preco_justo'] = empty($item['preco_justo']) ? 1.5 : ($item['preco_justo'] / 10000000);

        $item['preco_star1'] = $item['preco_justo'] > .7;
        $item['preco_star2'] = $item['preco_justo'] > 1.6;
        $item['preco_star3'] = $item['preco_justo'] > 2.6;

        $item['avaliacao_star1'] = $item['qualidade'] > .2;
        $item['avaliacao_star2'] = $item['qualidade'] > 1.2;
        $item['avaliacao_star3'] = $item['qualidade'] > 2.2;
        $item['avaliacao_star4'] = $item['qualidade'] > 3.2;
        $item['avaliacao_star5'] = $item['qualidade'] > 4.2;

        $item['avaliacao_star1_half'] = $item['qualidade'] > .2 && $item['qualidade'] < .7;
        $item['avaliacao_star2_half'] = $item['qualidade'] > 1.2 && $item['qualidade'] < 1.7;
        $item['avaliacao_star3_half'] = $item['qualidade'] > 2.2 && $item['qualidade'] < 2.7;
        $item['avaliacao_star4_half'] = $item['qualidade'] > 3.2 && $item['qualidade'] < 3.7;
        $item['avaliacao_star5_half'] = $item['qualidade'] > 4.2 && $item['qualidade'] < 4.7;

        $item['imagem'] = json_decode($item['imagem'], !0);
        if(!empty($item['imagem']))
            $item['imagem'] = $item['imagem'][0]['urls']['medium'];
        elseif(!empty($item['imagem_url']))
            $item['imagem'] = $item['imagem_url'];

        $data['data']['profissionaisTodo'][] = $item;
    }
}