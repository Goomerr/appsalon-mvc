<?php

namespace Controllers;

use Model\Cita;
use Model\CitaServicio;
use Model\Servicios;

class ApiController
{
    public $servicios;

    public static function index()
    {
        $servicios = Servicios::all();
        echo json_encode($servicios);
    }
    public static function guardar()
    {
        //Almacena la cita y devuelve el ID
        $cita = new Cita($_POST);
        $resultado = $cita->guardar();

        $id = $resultado['id'];

        //Almacenar los servicios con el ID de La Cita
        $idServicios  = explode(",", $_POST['servicios']);
        $resultado = [
            'servicios' => $idServicios
        ];

        foreach ($idServicios as $idServicio) {
            $args = [
                'citasId' => $id,
                'serviciosId' => $idServicio
            ];
            $citaServicio = new CitaServicio($args);
            $citaServicio->guardar();
        };

        echo json_encode(['resultado' => $resultado]);
    }
    public static function eliminar()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
            $cita = Cita::find($id);
            $cita->eliminar();
            //Redireccionar hacia la misma pagina de don de veníamos
            header('Location:' . $_SERVER['HTTP_REFERER']);
        }
    }
}
