<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Темплейт письма с контактов</title>
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
                            Добрый день, <?php echo $data['first_name'] .' '. $data['last_name'] ?> <br>
                            Мы очень рады, что вы с нами связались
                            <br>
                                Тема вашего письма была следующая:
                            </td>
                        </tr>
                        
                        <tr>
                            <td style="padding: 0px 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                <?php echo $data['description']  ?>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 20px 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                Мы ответим вам в ближайшее время!
                            </td>
                        </tr>
                        <!-- Call to action Button -->
                        <tr>
                            <td style="padding: 10px 40px 10px 40px; text-align: left;">
                                <!-- CTA Button -->
                                <table cellspacing="0" cellpadding="0" >
                                    <tr>
                                        <td align="center" >
                                          С уважением, команда <a href="ссылка на сайт" target="_blank" style=" text-decoration: none; font-weight: bold;">UN Games  </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </main>
</body>
</html>