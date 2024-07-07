<?php

namespace Classes;

use PHPMailer\PHPMailer\PHPMailer;

class Email
{
    public $email;
    public $nombre;
    public $token;
    public function __construct($email, $nombre, $token)
    {
        $this->email = $email;
        $this->nombre = $nombre;
        $this->token = $token;
    }

    public function enviarConfirmacion()
    {
        //Crear el objeto de email
        $mail = new PHPMailer();

        //Configurar SMTP
        $mail->isSMTP();
        $mail->Host = $_ENV['EMAIL_HOST'];
        $mail->SMTPAuth = true;
        $mail->Port = $_ENV['EMAIL_PORT'];
        $mail->Username = $_ENV['EMAIL_USER'];
        $mail->Password = $_ENV['EMAIL_PASS'];
        $mail->SMTPSecure = 'tls';

        //Configurar el contenido del Email
        $mail->setFrom('cuentas@appsalon.com');
        $mail->addAddress('cuentas@appsalon.com', 'AppSalon.com');
        $mail->Subject = 'Confirma tu Cuenta en AppSalon';

        //Habilitar HTML para el cuerpo del email
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';

        //Definir el contenido del Email
        $contenido = '<html>';
        $contenido .= "<p><strong>Hola " . $this->nombre . " </strong>Has creado una cuenta en AppSalon, confirma tu email para terminar de crearla.</p>";
        $contenido .= "<p>Pincha aquí: <a href='" . $_ENV['APP_URL'] . "/confirmar-cuenta?token=" . $this->token . "' >Confirmar Cuenta</a></p>";
        $contenido .= "<p>Si no creaste ninguna cuenta ignora este mensaje por favor</p>";
        $contenido .= "</html>";
        $mail->Body = $contenido;

        //Enviar el email
        $mail->send();
    }

    public function enviarInstrucciones()
    {
        //Crear el objeto de email
        $mail = new PHPMailer();

        //Configurar SMTP
        $mail->isSMTP();
        $mail->Host = $_ENV['EMAIL_HOST'];
        $mail->SMTPAuth = true;
        $mail->Port = $_ENV['EMAIL_PORT'];
        $mail->Username = $_ENV['EMAIL_USER'];
        $mail->Password = $_ENV['EMAIL_PASS'];
        $mail->SMTPSecure = 'tls';

        //Configurar el contenido del Email
        $mail->setFrom('cuentas@appsalon.com');
        $mail->addAddress('cuentas@appsalon.com', 'AppSalon.com');
        $mail->Subject = 'Restablece tu password en AppSalon';

        //Habilitar HTML para el cuerpo del email
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';

        //Definir el contenido del Email
        $contenido = '<html>';
        $contenido .= "<p><strong>Hola " . $this->nombre . " </strong>Has solicitado restablecer tu password sigue el siguiente enlace para hacerlo.</p>";
        $contenido .= "<p>Pincha aquí: <a href='" . $_ENV['APP_URL'] . "/recuperar?token=" . $this->token . "' >Restablecer Password</a></p>";
        $contenido .= "<p>Si no solicitaste este cambio ignora este mensaje por favor</p>";
        $contenido .= "</html>";
        $mail->Body = $contenido;

        //Enviar el email
        $mail->send();
    }
}
