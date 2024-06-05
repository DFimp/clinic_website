<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$config = include('config.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $phone = htmlspecialchars($_POST['phone']);

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; 
        $mail->SMTPAuth = true;
        $mail->Username = $config['smtp_username']; 
        $mail->Password = $config['smtp_password']; 
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;
        $mail->CharSet = 'UTF-8';

        $mail->setFrom($config['smtp_username'], 'Сайт для теста');
        $mail->addAddress($config['smtp_username']); // email получателя

        $mail->isHTML(true);
        $mail->Subject = 'Запись на прием';
        $mail->Body    = "ФИО: $name<br>Email: $email<br>Телефон: $phone";
        $mail->AltBody = "ФИО: $name\nEmail: $email\nТелефон: $phone";

        $mail->send();
        echo 'Сообщение отправлено';
    } catch (Exception $e) {
        echo "Ошибка при отправке сообщения: {$mail->ErrorInfo}";
    }
}
?>