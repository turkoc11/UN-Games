<!DOCTYPE html>
<html >
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo Yii::t('app', 'Темплейт письма с контактов')?></title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/normalize.css">
    <link rel="stylesheet" href="../public/styles.css">
</head>
<body>
    <main class="main">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td align="center" style="padding: 20px;">
                    <table  width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #cccccc;">
                        <tr>
                            <td style="padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                <?php echo Yii::t('app', 'Новое сообщение на сайте UN games')?>
                            <br>
                                <?php echo Yii::t('app', 'Контент письма:')?>
                            </td>
                        </tr>
                        
                        <tr>
                            <td style="padding: 0px 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                <?php  echo $data['first_name']?>
                            </td>

                            <td style="padding: 0px 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                <?php  echo $data['last_name']?>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 20px 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                <?php  echo $data['email']?>
                            </td>
                        </tr>        
                        
                        <tr>
                            <td style="padding: 20px 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                <?php  echo $data['description']?>
                             </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </main>
</body>
</html>