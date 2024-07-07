document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
});

function iniciarApp() {
  //Buscar por fecha
  const fechaInput = document.querySelector("#fecha");
  fechaInput.addEventListener("input", function () {
    const fechaSeleccionada = fechaInput.value;
    window.location = `?fecha=${fechaSeleccionada}`;
  });
}
