<?php
namespace app\models;
use Yii;
use yii\base\Model;
use yii\helpers\FileHelper;

class Db extends Model
{
    public function getFiles($files){
        Yii::$app->params['count_db'] = count($files);
        $arr = array();
        foreach($files as $key => $file){
            $arr[] = array('dump' =>$file);
        }
        $dataProvider = new \yii\data\ArrayDataProvider([
            'allModels' => $arr,
            'sort' => [
                'attributes' => ['dump'],
            ],
            'pagination' => [
                'pageSize' => 10,
            ],
        ]);
        return $dataProvider;
    }
    public function import($path) {
        
        $fileArray = explode('/', $path);
        $file = $fileArray[count($fileArray) - 1];
        
        if (file_exists($path)) {     
            $path = \yii\helpers\Html::encode($path);
            $db = Yii::$app->getDb();
           
            if (!$db) {
                Yii::$app->session->setFlash('error', 'Нет подключения к базе данных.');
            }          
            exec('cd ../ && php yii backup/restore '.$file);
           
        } else {            
            return Yii::$app->response->redirect(['admin/db/index']);
        }        
        return Yii::$app->response->redirect(['admin/db/index']);
    }

    public function export($path = null) {
        $path = FileHelper::normalizePath(Yii::getAlias($path));
        // var_dump($path); die(); 
        if (file_exists($path)) {
            
            if (is_dir($path.'/')) {
                
                if (!is_writable($path.'/')) {
                    return Yii::$app->response->redirect(['admin/db/index']);
                }
                           
                $db = Yii::$app->getDb();
                // var_dump($db); die();   
                if (!$db) {                    
                    return Yii::$app->response->redirect(['admin/db/index']);
                }               
                exec('cd ../ && php yii backup/backup');
                
            } else {                
                return Yii::$app->response->redirect(['admin/db/index']);
            }
        } else {            
            return Yii::$app->response->redirect(['admin/db/index']);
        }
        return Yii::$app->response->redirect(['admin/db/index']);
    }
    //Возвращает название хоста (например localhost)
    private function getDsnAttribute($name, $dsn) {
        if (preg_match('/' . $name . '=([^;]*)/', $dsn, $match)) {
            return $match[1];
        } else {
            return null;
        }
    }
    public function delete($path) {                 
        if (file_exists($path)) {
            $path = \yii\helpers\Html::encode($path);
            unlink($path);
            Yii::$app->session->setFlash('success', 'Дамп БД удален.');
        } else {
            Yii::$app->session->setFlash('error', 'Указанный путь не существует.');
        }
        return Yii::$app->response->redirect(['admin/db/index']);        
    }
}