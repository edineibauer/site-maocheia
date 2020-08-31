<?php

if(!empty($_SESSION['userlogin']) && $_SESSION['userlogin']['id'] > 0) {
    $sql = new \Conn\SqlCommand();
    $sql->exeCommand("SELECT COUNT(*) as total FROM " . PRE . "messages_user WHERE recebido = 0 AND ownerpub = {$_SESSION['userlogin']['id']}");
    $data['data'] = $sql->getResult()[0]['total'];
}