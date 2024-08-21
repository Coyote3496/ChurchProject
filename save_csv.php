<?php
if (isset($_POST['data'])) {
    $data = $_POST['data'];
    $file = 'responses.csv';
    
    file_put_contents($file, $data, FILE_APPEND);
}
?>
