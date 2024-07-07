<?php

namespace Controllers;

use Model\AdminCitas;
use MVC\Router;

class AdminController
{
    public static function index(Router $router)
    {
        session_start();

        isAdmin();

        //extraer la fecha de la url
        $fecha = $_GET['fecha'] ?? date('Y-m-d');
        //separar mes dia y año de la fecha
        $fechas = explode('-', $fecha);
        //revisar que la fecha sea correcta
        if (!checkdate($fechas[1], $fechas[2], $fechas[0])) {
            header('Location: /404');
        }

        //Consultar la BD
        $consulta = "SELECT citas.id, citas.hora, CONCAT( usuarios.nombre, ' ', usuarios.apellido) as cliente, ";
        $consulta .= " usuarios.email, usuarios.telefono, servicios.nombre as servicio, servicios.precio  ";
        $consulta .= " FROM citas  ";
        $consulta .= " LEFT OUTER JOIN usuarios ";
        $consulta .= " ON citas.usuarioId=usuarios.id  ";
        $consulta .= " LEFT OUTER JOIN citasservicios ";
        $consulta .= " ON citasservicios.citasId=citas.id ";
        $consulta .= " LEFT OUTER JOIN servicios ";
        $consulta .= " ON servicios.id=citasservicios.serviciosId ";
        $consulta .= " WHERE fecha =  '$fecha' ";

        $citas = AdminCitas::SQL($consulta);


        $router->render('admin/index', [
            'nombre' => $_SESSION['nombre'],
            'citas' => $citas,
            'fecha' => $fecha
        ]);
    }
}