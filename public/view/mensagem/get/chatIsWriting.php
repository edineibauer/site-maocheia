<?php

if(!empty($variaveis[0])) {
    \Helpers\Helper::createFolderIfNoExist(PATH_HOME . "_cdn/chat");
    \Helpers\Helper::createFolderIfNoExist(PATH_HOME . "_cdn/chat/" . $variaveis[0]);
    \Config\Config::createFile(PATH_HOME . "_cdn/chat/" . $variaveis[0] . "/" . $_SESSION['userlogin']['id'] . ".txt", "");
}