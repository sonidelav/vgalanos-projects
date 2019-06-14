<?php
require (__DIR__.'/php/lib.php');
define('ROOT_FOLDER', __DIR__);

// Request Action
new CAction(function(CAction $action) {

    if($action->isGet())
    {
        $func = $action->getParam('func');
        switch($func)
        {
            case 'entries':

                $targetRoot = $action->getParam('root', false);
                if($targetRoot) {
                    $fileManager = new CFileManager($targetRoot);
                } else {
                    $fileManager = new CFileManager(ROOT_FOLDER);
                }

                $entries = $fileManager->getEntries();
                $action->returnJSONResponse($entries);
                break;

            case 'contents':
                $targetFile = $action->getParam('file', false);
                if($targetFile) {
                    $contents = file_get_contents($targetFile);
                    header('Content-Type: text/plain;charset=UTF-8');
                    echo $contents;
                }
                break;

            case 'download':
                $targetFile = $action->getParam('file', false);
                if($targetFile) {
                    $name = basename($targetFile);
                    header("Content-disposition: attachment; filename=$name");
                    //header("Content-type: application/pdf");
                    readfile($targetFile);
                }
                break;

            case 'stream':
                $targetFile = $action->getParam('file', false);
                if($targetFile) {
                    $fileManager = new CFileManager(dirname($targetFile));
                    $fileManager->getStream(basename($targetFile));
                }
                break;
        }
    }

});
