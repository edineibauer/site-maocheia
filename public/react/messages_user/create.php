<?php

/**
 * User is not silence and not online
 * so send notification
 */
$sql = new \Conn\SqlCommand();
$sql->exeCommand("SELECT c.imagem, c.perfil_profissional FROM " . PRE . "clientes as c WHERE c.usuarios_id = {$dados['usuario']}");
if($sql->getResult()) {
    $item = $sql->getResult()[0];
    $item['perfil_profissional'] = !empty($item['perfil_profissional']) ? json_decode($item['perfil_profissional'], !0) : [];
    $imagem = (!empty($item['perfil_profissional']) && !empty($item['perfil_profissional']['imagem_de_perfil']) ? $item['perfil_profissional']['imagem_de_perfil'][0]['urls']['thumb'] : (!empty($item['imagem']) ? json_decode($item['imagem'], !0)[0]['urls']['thumb'] : HOME . "public/assets/svg/account.svg"));

    \Notification\Notification::push($_SESSION['userlogin']['setorData']['nome'], $dados["ultima_mensagem"], $dados['usuario'], $imagem);
}
