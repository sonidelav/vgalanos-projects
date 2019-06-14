<?php
// Include Core API Library
include_once 'classes/XRequest.php';
include_once 'classes/XRouter.php';
include_once 'classes/XUIService.php';


class Core
{
  protected $_request;
  protected $_response;
  protected $_helpers;

  // Core Components
  protected $_router;
  
  // Instance Core
  protected static $_core;
  public static function startup() {
    if(!self::$_core) {
      self::$_core = new Core();
    }
    return self::$_core;
  }
  
  public static function API() {
    return self::$_core;
  }
  
  public static function debug($object) {
      echo "<pre>";
      echo print_r($object, true);
      echo "</pre>";
  }
  
  public function __construct() {
    ob_start();
    $this->_request = new HTTPRequest();
    $this->_router  = new HTTPRouter($this->_request);
  }
  
  public function getRequest() {
    return $this->_request;
  }
  
  public function getRouter() {
    return $this->_router;
  }
  
  public function run() {
      $this->_router->run();
      ob_end_flush();
  }
}
?>