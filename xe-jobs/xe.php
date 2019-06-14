<?php
class Request {
    const METHOD_POST = 'POST';
    const METHOD_GET = 'GET';
    
    public $method;
    public $parameters;
    public $headers;
    
    public function __construct() {
        $server = $_SERVER;
        $params = $_REQUEST;
        
        $this->headers = $server;
        $this->parameters = $params;
        $this->method = $server['REQUEST_METHOD'];
    }
}

$request = new Request();


$daysOld = isset($request->parameters['age']) ? $request->parameters['age'] : 0;

$xeURL2 = "http://www.xe.gr/jobs/search?".
	"Item.category__hierarchy=140262".
	"&System.item_type=xe_stelexos".
	"&Transaction.type_channel=117538".
	(($daysOld > 0) ? "&Publication.age=".$daysOld : '').
	"&per_page=1000";
	
$xeURL = "http://www.xe.gr/search?".
    "Geo.area_id_new__hierarchy=82196".
    "&Item.master_subtype=115777".
    "&Item.master_type=114549".
    "&Publication.age=".$daysOld.
    "&System.item_type=xe_stelexos".
    "&Transaction.type_channel=117538".
    "&per_page=1000";



$html = file_get_contents($xeURL2, false);
echo $html;