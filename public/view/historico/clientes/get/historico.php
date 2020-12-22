<?php

$read = new \Conn\Read();
$read->exeRead("historico", "WHERE system_id IS NULL ORDER BY data DESC");
$data['data'] = $read->getResult();