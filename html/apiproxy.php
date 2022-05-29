<?php
 $ch = curl_init($_GET['url']);
 $fileContents = curl_exec($ch);
?>