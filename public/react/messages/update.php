<?php

/**
 * User is not silence and not online
 * so send notification
 */
$sql = new \Conn\SqlCommand(!0);
$sql->exeCommand("SELECT c.imagem, c.perfil_profissional, mu.ownerpub, mu.silenciado FROM " . PRE . "messages_user as mu JOIN " . PRE . "clientes as c ON c.usuarios_id = mu.ownerpub WHERE mu.mensagens = {$dados['id']} AND usuario = {$_SESSION['userlogin']['id']}");
if($sql->getResult() && $sql->getResult()[0]['silenciado'] == 0) {
    $item = $sql->getResult()[0];
    $item['perfil_profissional'] = !empty($item['perfil_profissional']) ? json_decode($item['perfil_profissional'], !0) : [];
    $imagem = (!empty($item['perfil_profissional']) && !empty($item['perfil_profissional']['imagem_de_perfil']) ? $item['perfil_profissional']['imagem_de_perfil'][0]['urls']['thumb'] : (!empty($item['imagem']) ? json_decode($item['imagem'], !0)[0]['urls']['thumb'] : HOME . "public/assets/svg/account.svg"));

    $lastMessage = json_decode($dados['mensagens'], !0);

    \Notification\Notification::push($_SESSION['userlogin']['setorData']['nome'], end($lastMessage)['mensagem'], $item['ownerpub'], $imagem);
}
