<?php
include_once 'XRequest.php';

interface XRouter
{
  public function setRoutes(array $routes);
  public function runRoute($name);
  public function run();
}

interface XRoute
{
  public function run($params);
}

class HTTPRouter implements XRouter {

    /**
     * @var XRequest HTTP Request Object
     */
    protected $_request;
    /**
     * @var array Router Routes
     */
    protected $_routes;

    public function __construct($request=null) {
        // Read Request
        $this->init_request($request);
        $this->_routes = array();
    }

    public function setRoutes(array $routes)
    {
        $this->_routes = $routes;
    }

    public function runRoute($name)
    {
      $routeParts = explode('/',$name);
      
      $routes = $this->_routes;
      if(!empty($routes))
      {
        $route = isset($routes[$routeParts[0]]) ? $routes[$routeParts[0]] : null;
        if($route) {
            $className = $route['class']; unset($route['class']);          
            $route['action'] = isset($routeParts[1]) ? $routeParts[1] : (isset($route['defaultAction']) ? $route['defaultAction'] : 'index');
            $route['params'] = array_slice($routeParts, 2);
            $routeInstance = new $className();
            $routeInstance->run($route);
        } else {
          throw new Exception('Not Found "' . $name . '"');
        }
      } else {
        throw new Exception('No Routes Specified.');
      }
    }
  
    public function run()
    {
        $route = $this->_request->getRoute();
        $this->runRoute($route);
    }



    protected function init_request($request)
    {
        if(!$this->_request && $request) {
            $this->_request = $request;
        } elseif(!$this->_request) {
            $this->_request = new HTTPRequest();
        }
    }
}

?>