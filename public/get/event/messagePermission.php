<?php

$data['data'] = !0;
if(!empty($_SESSION['userlogin']['setorData']['perfil_profissional'])) {

    $user = $variaveis[0];
    $read = new \Conn\Read();
    $read->exeRead("messages_user", "WHERE usuario = :u", "u={$user}");
    if($read->getResult()) {
        $data['data'] = $read->getResult()[0]['aceito'] == 1 ? !0 : !1;
    } else {
        $data['data'] = !file_exists(PATH_HOME . "_cdn/chat/{$_SESSION['userlogin']['id']}/pending/" . $user);
    }
}