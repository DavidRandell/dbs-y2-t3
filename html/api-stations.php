<?php
   
    $content = file_get_contents('https://api.irishrail.ie/realtime/realtime.asmx/getAllStationsXML');
     
    echo $content;
     
?>