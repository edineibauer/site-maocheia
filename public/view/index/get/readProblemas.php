<?php

$read = new \Conn\Read();
$read->exeRead("problemas", 'ORDER BY buscas DESC LIMIT 20');
$data['data'] = $read->getResult();