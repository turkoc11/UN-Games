<!DOCTYPE html>
<html lang="en">
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
                        <!-- Body -->
                        <tr>
                            <td style="padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                <?php echo Yii::t('app', 'На сайте UN Games новая подписка')?>
                            </td>
                        </tr>
                        
                        <tr>
                            <td style="padding: 0px 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                <?php echo $data['email'] ?>
                            </td>
                        </tr>

                       
                        <!-- Call to action Button -->
                    </table>
                </td>
            </tr>
        </table>
    </main>
</body>
</html>