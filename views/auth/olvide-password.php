<h1 class="nombre-pagina">¿Olvidaste tu Password?</h1>
<p class="descripcion-pagina">Restablece tu password, escribe tu email.</p>
<?php
include_once __DIR__ . "/../templates/alertas.php";
?>

<form class="formulario" method="POST" action="olvide">
    <div class="campo">
        <label for="email">Email</label>
        <input type="email" name="email" id="email" placeholder="Tu Email">
    </div>
    <input type="submit" class="boton" value="Enviar">
</form>
<div class="acciones">
    <a href="/">¿Ya tienes cuenta? Inicia Sesión</a>
    <a href="/crear-cuenta">¿Aún no tienes cuenta? Crea una</a>
</div>