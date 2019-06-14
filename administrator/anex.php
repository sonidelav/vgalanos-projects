<?php
/**
 * Service Proxy Prototype script
 */
$domain = 'anexartito.gr';

$request_path = $_SERVER['PATH_INFO'];
$request_method = $_SERVER['REQUEST_METHOD'];
$request_query = $_SERVER['QUERY_STRING'];

$s_fp = fsockopen($domain,80, $errno, $errstr, 30);
if(!$s_fp)
{
    echo "$errstr ($errno)";
} else {
    $out = implode("\r\n",array(
        "$request_method $request_path?$request_query HTTP/1.0",
        "Host: $domain",
        "Connection: close",
    ))."\r\n\r\n";
    
    fwrite($s_fp, $out);
    $data=null;
    while(!feof($s_fp)) {
        $data .= fgets($s_fp, 128);
    }
    fclose($s_fp);
    
    list($headers, $body) = explode("\r\n\r\n", $data);
    $headers = explode("\r\n", $headers);
    $heads=array();
    foreach($headers as $_h) {
        $s = explode(':',$_h);
        $heads[$s[0]] = isset($s[1]) ? $s[1] : null;
    }
    $send_header1 = $headers[0];
    $send_header2 = "Content-Type: {$heads['Content-Type']}";

    header($send_header1);
    header($send_header2);
    if(preg_match('/200/', $send_header1)) {
        echo $body;
    }
}
