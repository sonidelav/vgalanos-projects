<?php 
include_once 'core/core.php';

class MoviesService implements XRoute
{	
	
	const TAINIES_ONLINE_HOST = 'tainies.online';
	
	public function run($route) {
		header('Access-Control-Allow-Origin: *');
		$action = $route['action'];
		$this->$action($route['params']);
	}
	
	public function titles($params)
	{
			$url = 'http://'.self::TAINIES_ONLINE_HOST.'/titles/paginate';
			$request_params = Core::API()->getRequest()->getAllParams();
			
			$q = http_build_query($request_params);
		
			$curl = curl_init();
			curl_setopt_array($curl, array(
				    CURLOPT_RETURNTRANSFER => 1,
						CURLOPT_URL => $url . '?' . $q,
						CURLOPT_USERAGENT => '-',
						//CURLOPT_POST => 1,
						//CURLOPT_POSTFIELDS => $request_params
			));
		
			$resp = curl_exec($curl);
			curl_close($curl);
		
			header('X-Service-Url: '. $url);
			header('Content-Type: application/json;charset=UTF-8');
			echo json_encode(array(
				'url' => $url . '?' . $q,
				'response' => json_decode($resp)
			));
	}
}

$core = Core::startup();
$router = $core->getRouter();
$router->setRoutes(array(
		'movies' => array('class' => 'MoviesService')
));

$core->run();
?>