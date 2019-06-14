<?php
class CAction
{
    const REQUEST_GET_METHOD = 'GET';
    const REQUEST_POST_METHOD = 'POST';
    const REQUEST_PUT_METHOD = 'PUT';
    const REQUEST_DELETE_METHOD = 'DELETE';
    const REQUEST_OPTIONS_METHOD = 'OPTIONS';

    protected $method;
    protected $params;
    
    protected $callback;
    protected $call_params;
    
    public function __construct($callback=null, $callback_params=array()) {
        $this->method = $_SERVER['REQUEST_METHOD'];
        $this->params = $_REQUEST;
        $this->callback = $callback;
        $this->call_params = $callback_params;
        $this->run();
    }
    
    public function run()
    {
        if(is_callable($this->callback)) {
            $params = array_merge(array($this), $this->call_params);
            call_user_func_array($this->callback, $params);

            //call_user_func_array($this->callback, $params);
            //call_user_func($this->callback,$this->call_params,$this);
        }
    }
    
    public function returnJSONResponse($data, $status=200, $msg='OK')
    {
        header($_SERVER['SERVER_PROTOCOL']." $status $msg");
        header('Content-Type: application/json;charset=UTF-8');
        echo json_encode($data);
    }

    public function getParam($name, $default=null)
    {
        return isset($this->params[$name]) ? $this->params[$name] : $default;
    }

    public function getMethod()
    {
        return $this->getMethod();
    }

    public function isGet() {
        return $this->method == self::REQUEST_GET_METHOD;
    }

    public function isPost() {
        return $this->method == self::REQUEST_POST_METHOD;
    }
}

class CFileManager
{
    public $rootPath;
    
    protected $_dir_handle;
    
    public function __construct($rootPath) {
        $this->rootPath = $rootPath;
    }
    
    public function getEntries()
    {
        $entries = array();
        $handle = opendir($this->rootPath);
        while(($entry = readdir($handle)) !== FALSE) {
            if($entry !== '..' AND $entry !== '.') {
                $entry_path = $this->rootPath.DIRECTORY_SEPARATOR.$entry;
                $entries[] = new CFile($entry_path);
            }
        }
        return $entries;
    }
    
    public function getStream($file) {
        
        $filename = $this->rootPath . DIRECTORY_SEPARATOR . $file;
        $fp = fopen($filename, 'rb');
        
        $size = filesize($filename);
        $length = $size;
        $start = 0;
        $end = $size -1;
        
        header('Content-Type: video/mp4');
        header("Accept-Ranges: bytes");
        if (isset($_SERVER['HTTP_RANGE'])) {
            $c_start = $start;
            $c_end = $end;
            list(, $range) = explode('=', $_SERVER['HTTP_RANGE'], 2);
            if (strpos($range, ',') !== false) {
                header('HTTP/1.1 416 Requested Range Not Satisfiable');
                header("Content-Range: bytes $start-$end/$size");
                exit;
            }
            if ($range == '-') {
                $c_start = $size - substr($range, 1);
            } else {
                $range = explode('-', $range);
                $c_start = $range[0];
                $c_end = (isset($range[1]) && is_numeric($range[1])) ? $range[1] : $size;
            }
            $c_end = ($c_end > $end) ? $end : $c_end;
            if ($c_start > $c_end || $c_start > $size - 1 || $c_end >= $size) {
                header('HTTP/1.1 416 Requested Range Not Satisfiable');
                header("Content-Range: bytes $start-$end/$size");
                exit;
            }
            $start = $c_start;
            $end = $c_end;
            $length = $end - $start + 1;
            fseek($fp, $start);
            header('HTTP/1.1 206 Partial Content');
        }
        
        header("Content-Range: bytes $start-$end/$size");
        header("Content-Length: " . $length);
        $buffer = 1024 * 8;
        while (!feof($fp) && ($p = ftell($fp)) <= $end) {
            if ($p + $buffer > $end) {
                $buffer = $end - $p + 1;
            }
            set_time_limit(0);
            echo fread($fp, $buffer);
            flush();
        }
        fclose($fp);
        exit;
    } // End of Get Stream
}

class CFile
{
    const TYPE_FILE = 'File';
    const TYPE_DIR  = 'Directory';
    
    public $name;
    public $path;
    public $type;
    public $size;
    
    public function __construct($path) {
        $this->name = basename($path);
        $this->path = $path;
        $this->type = (is_dir($path)) ? self::TYPE_DIR : self::TYPE_FILE;
        if($this->type === self::TYPE_FILE) {
            if(file_exists($path)) {
                $this->size = filesize($path);
            }
        } else {
            $this->size = 4*1024;
        }
    }
    
    public function toJSON() {
        return json_encode(array(
            'name' => $this->name,
            'path' => $this->path,
            'type' => $this->type,
            'size' => $this->size,
        ));
    }

}