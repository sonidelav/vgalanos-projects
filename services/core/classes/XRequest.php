<?php
interface XRequest
{
  public static function listenRequest();
  public static function getRequest();

  public function getMethod();
  public function getPayload();
  public function getHeaders();
  public function hasHeader($name);
  public function getHeader($name);
  public function getAllParams();

  public function isRequestType($type);
}

/**
  @class HTTPRequest
*/
class HTTPRequest implements XRequest
{
  const REQUEST_METHOD_POST = 'POST';
  const REQUEST_METHOD_GET  = 'GET';
  
  protected $_server;
  protected $_request;
  protected $_params;
  protected $_payload;
  
  public function __construct() 
  {
    $this->_server = $_SERVER;
    $this->_request = $_SERVER[HTTPHeaders::REQUEST_METHOD];
    $this->_params = $_REQUEST;
    $this->_payload = file_get_contents('php://input');
  }
  
  // Global Entry Point
  private static $s_req;
  public static function listenRequest()
  {
    if(!self::s_req) self::$s_req = new HTTPRequest();
  }
  public static function getRequest()
  {
    return self::$s_req ? self::$s_req : null;
  }
  
  public function getMethod()
  {
    return $this->_request;
  }
  
  public function getHeaders()
  {
    return $this->_server;
  }
  
  public function getAllParams()
  {
    return $this->_params;
  }
  
  public function getParam($name, $default=true)
  {
    return isset($this->_params[$name]) ? $this->_params[$name] : $default;
  }
  
  public function isRequestType($type)
  {
    if($this->_request == REQUEST_METHOD_GET) return true;
    if($this->_request == REQUEST_METHOD_POST) return true;
    return false;
  }
  
  public function getHeader($name, $default=null)
  {
    return isset($this->_server[$name]) ? $this->_server[$name] : $default;
  }
  
  public function hasHeader($name) 
  {
    return isset($this->_server[$name]) ? true : false;
  }

  public function getServer($name)
  {
    return isset($this->_server[$name]) ? $this->_server[$name] : null;
  }
  
  
  public function getRoute() {
    $route = $this->getParam('route');
    if($route) {
      unset($this->_params['route']);
      return $route;
    } else {
      return null;
    }
  }
  
  public function getPayload() {
    return $this->_payload;
  }
}

class HTTPHeaders
{
  const REMOTE_ADDR = 'REMOTE_ADDR';
  
  const REQUEST_URI = 'REQUEST_URI';
  const REQUEST_METHOD = 'REQUEST_METHOD';
  const QUERY_STRING = 'QUERY_STRING';
  
  const SERVER_NAME = 'SERVER_NAME';
  const SERVER_ADDR = 'SERVER_ADDR';
  const SERVER_PROTOCOL ='SERVER_PROTOCOL';
  
  const HTTP_USER_AGENT = 'HTTP_USER_AGENT';
  const HTTP_ACCEPT = 'HTTP_ACCEPT';
  const HTTP_HOST = 'HTTP_HOST';
  const HTTP_ACCEPT_LANGUAGE = 'HTTP_ACCEPT_LANGUAGE';
  
  public static function getArray()
  {
    $ref = new ReflectionClass('HTTPHeaders');
    return $ref->getConstants();
  }
}
?>