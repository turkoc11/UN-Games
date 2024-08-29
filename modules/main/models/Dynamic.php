<?php

namespace app\modules\main\models;

use yii\helpers\FileHelper;
use yii\web\UploadedFile;

/**
 * Class Dynamic
 * @package app\modules\admin\models
 */
class Dynamic extends \app\models\Dynamic
{
    public $tempImage;


    public function upload()
    {
        if ($this->validate()) {

            if ($this->tempImage instanceof UploadedFile) {
                @FileHelper::unlink(\Yii::getAlias('@webroot') . $this->image);
                $file_name = \Yii::$app->controller::sanitizeFileName($this->tempImage->baseName) . '.' . $this->tempImage->extension;
                if (!is_dir(\Yii::getAlias('@webroot/images/dynamic/'))) {
                    mkdir(\Yii::getAlias('@webroot/images/dynamic/'));
                }
                if ($this->tempImage->saveAs(\Yii::getAlias('@webroot/images/dynamic/') . $file_name)) {
                    return '/images/dynamic/' . $file_name;
                };
            } else {
                return $this->image;
            }
        }

        return false;
    }
}
