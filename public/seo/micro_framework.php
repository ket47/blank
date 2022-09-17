<?php
spl_autoload_register(function ($class_name) {
    include_once __DIR__.'/'.str_replace('\\','/',$class_name) . '.php';
});
function handleCors(){
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, access-control-allow-origin");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Origin:*");
    $method = $_SERVER['REQUEST_METHOD'];
    if( $method == "OPTIONS" ) {
        die();
    }
}
handleCors();
function mb_escape(string $string){
    return mb_ereg_replace('[\x00\x0A\x0D\x1A\x22\x27\x5C]', '\\\0', $string);
}
function argumentsParse( $Class, $method, $uri_id ){
    if( !method_exists($Class,$method) ){
        http_response_code(404);
        die('"Page not found"');
    }
    $arguments=[];
    $reflectionMethod = new ReflectionMethod($Class, $method);
    $method_args_config = $reflectionMethod->getParameters();
    foreach( $method_args_config as $param ){
        $param_name=$param->getName();
        $param_default=$param->isDefaultValueAvailable()?$param->getDefaultValue():null;
        $arguments[]=mb_escape($_REQUEST[$param_name])??$param_default;
    }
    $arguments[]=$uri_id;
    return $arguments;
}
function view( $path, $data ){
    extract($data);
    include "Views/header.php";
    include "Views/{$path}.php";
    include "Views/footer.php";
}
function parseDotEnv(){
    $dotenv=file_get_contents('../../.env');
    $lines = preg_split("/[\n\r]+/", $dotenv);
    foreach($lines as $line){
        $var=explode('=',$line);
        if( strpos(trim($var[0]),'#')===0 ){
            continue;
        }
        putenv(trim($var[0])."=".trim($var[1]));
    }
}
parseDotEnv();



try{
    $uri=$_SERVER['REQUEST_URI'];
    if( strpos($uri,'index.php')!==false ){
        $uri=explode('index.php',$uri)[1];
    }
    $uri_parts=explode('/',explode('?',$uri)[0]);
    @list($uri_first,$uri_controller,$uri_method_and_id)=$uri_parts;
    @list($uri_method,$uri_id)=explode('-',$uri_method_and_id);

    $uri_controller=$uri_controller?$uri_controller:'catalog';
    $uri_method=$uri_method?$uri_method:'index';

    $Controller=new ('\Controllers\\'.ucfirst($uri_controller));
    $arguments= argumentsParse($Controller, $uri_method,$uri_id);
    $result=$Controller->$uri_method(...$arguments);
    if($result!==null){
        echo json_encode( $result );
    }
} catch (Error $ex) {
    $code=$ex->getCode();
    $message=$ex->getMessage();
    http_response_code($code?$code:'500');
    die($message);
}
