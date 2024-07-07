<h1 class="nombre-pagina">Recupera tu Password</h1>
<p class="descripcion-pagina">Escribe tu nuevo Password a continuación</p>
<?php
include_once __DIR__ . "/../templates/alertas.php";
?>

<?php if ($error) return null; ?>

<form class="formulario" method="POST">
    <div class="campo">
        <label for="password">Password</label>
        <input type="password" name="password" id="password" placeholder="Tu nuevo password">
    </div>
    <input type="submit" class="boton" value="Guardar Password">
</form>
<div class="acciones">
    <a href="/">¿Ya tienes cuenta? Inicia Sesión</a>
    <a href="/crear-cuenta">¿Aún no tienes cuenta? Crea una</a>
</div>