<?php

if (!empty($dados['perfil_profissional']) && \Helpers\Check::isJson($dados['perfil_profissional'])) {
    $p = json_decode($dados['perfil_profissional'], !0)[0];

    $profissional = [
        'nome' => $dados['nome'],
        'categoria' => (int)$p['categoria'],
        'subcategorias' => !empty($p['subcategorias']) ? json_encode($p['subcategorias']) : null,
        'imagem_de_perfil' => !empty($p['imagem_de_perfil']) ? json_encode($p['imagem_de_perfil']) : null,
        'imagem_de_fundo' => !empty($p['imagem_de_fundo']) ? json_encode($p['imagem_de_fundo']) : null,
        'cartao_de_credito' => !empty($p['cartao_de_credito']) ? json_encode($p['cartao_de_credito']) : null,
        'galeria' => !empty($p['galeria']) ? json_encode($p['galeria']) : null,
        'sobre' => $p['sobre'] ?? "",
        'inicio' => $p['inicio'] ?? "",
        'termino' => $p['termino'] ?? "",
        'dias' => !empty($p['dias']) ? json_encode($p['dias']) : null,
        'atendimento' => $p['atendimento'] ?? 0,
        'qualidade' => $p['qualidade'] ?? 0,
        'preco_justo' => $p['preco_justo'] ?? 0,
        'total_de_avaliacoes' => $p['total_de_avaliacoes'] ?? 0
    ];

    $up = new \Conn\Update();
    if (empty($dados['perfil_profissional_id'])) {

        /**
         * Cria perfil profissional na sua tabela
         */
        $create = new \Conn\Create();
        $create->exeCreate("profissional", $profissional);
        if ($create->getResult()) {

            /**
             * Atualiza perfil do cliente com o ID do perfil profissional na sua tabela de cliente
             */
            $up->exeUpdate("clientes", ["perfil_profissional_id" => $create->getResult()], "WHERE id = :id", "id={$dados['id']}");
        }
    } else {

        /**
         * Atualiza perfil profissional na sua tabela
         */
        $up->exeUpdate("profissional", $profissional, "WHERE id = :id", "id={$dados['perfil_profissional_id']}");
    }
}