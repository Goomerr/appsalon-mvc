let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
  id: "",
  nombre: "",
  fecha: "",
  hora: "",
  servicios: []
};

document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
});

function iniciarApp() {
  mostrarSeccion(); //muestra y oculta las secciones
  tabs(); //Cambiar de sección cuando se presionen los tabs
  botonesPaginador(); //Mostrar/ocultar botones paginador
  paginaSiguiente();
  paginaAnterior();

  consultarApi(); //Consultar una API en el BACKEND de PHP para obtener los servicios

  idCliente(); //añade el ID del cliente al objeto de citas
  nombreCliente(); //añade el nombre del cliente al objeto de citas
  fechaCita(); //añade la fecha del la cita al objeto de citas
  horaCita(); //añade la hora del la cita al objeto de citas
  mostrarResumen(); //MOstrar el resumen de la cita
}

function mostrarSeccion() {
  //ocultar la sección anterior
  const seccionAnterior = document.querySelector(".mostrar");
  if (seccionAnterior) {
    seccionAnterior.classList.remove("mostrar");
  }
  //Seleccionar la sección por su numero de paso
  const selectorPaso = `#paso-${paso}`;
  const seccion = document.querySelector(selectorPaso);
  seccion.classList.add("mostrar");

  //Quitar clase actual al tab anterior
  const tabAnterior = document.querySelector(".actual");
  tabAnterior.classList.remove("actual");
  //Resaltar el tab actual
  const tab = document.querySelector(`[data-paso="${paso}"]`);
  tab.classList.add("actual");
}

function tabs() {
  const botones = document.querySelectorAll(".tabs button");

  botones.forEach((boton) => {
    boton.addEventListener("click", function (e) {
      paso = parseInt(e.target.dataset.paso);
      mostrarSeccion();
      botonesPaginador();
    });
  });
}

function botonesPaginador() {
  const paginaAnterior = document.querySelector("#anterior");
  const paginaSiguiente = document.querySelector("#siguiente");

  if (paso === 1) {
    paginaAnterior.classList.add("ocultar");
    paginaSiguiente.classList.remove("ocultar");
  } else if (paso === 3) {
    paginaAnterior.classList.remove("ocultar");
    paginaSiguiente.classList.add("ocultar");
    mostrarResumen();
  } else {
    paginaSiguiente.classList.remove("ocultar");
    paginaAnterior.classList.remove("ocultar");
  }
  mostrarSeccion();
}

function paginaAnterior() {
  const paginaAnterior = document.querySelector("#anterior");
  paginaAnterior.addEventListener("click", function () {
    if (paso <= pasoInicial) return;
    paso--;

    botonesPaginador();
  });
}
function paginaSiguiente() {
  const paginaSiguiente = document.querySelector("#siguiente");
  paginaSiguiente.addEventListener("click", function () {
    if (paso >= pasoFinal) return;
    paso++;

    botonesPaginador();
  });
}

async function consultarApi() {
  try {
    const url = "/api/servicios";
    const resultado = await fetch(url);
    const servicios = await resultado.json(resultado);
    mostrarServicios(servicios);
  } catch (error) {
    console.log(error);
  }
}

function mostrarServicios(servicios) {
  servicios.forEach((servicio) => {
    const { id, nombre, precio } = servicio;

    const nombreServicio = document.createElement("P");
    nombreServicio.classList.add("nombre-servicio");
    nombreServicio.textContent = nombre;

    const precioServicio = document.createElement("P");
    precioServicio.classList.add("precio-servicio");
    precioServicio.textContent = `${precio}€`;

    const servicioDiv = document.createElement("DIV");
    servicioDiv.classList.add("servicio");
    servicioDiv.dataset.idServicio = id;
    servicioDiv.onclick = function () {
      seleccionarServicio(servicio);
    };

    servicioDiv.appendChild(nombreServicio);
    servicioDiv.appendChild(precioServicio);

    document.querySelector("#servicios").appendChild(servicioDiv);
  });
}

function seleccionarServicio(servicio) {
  const { id } = servicio;
  const { servicios } = cita;
  //Identificar el elemento al que se da click
  const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

  //comprobar sin un servicio ya fue seleccionado
  if (servicios.some((agregado) => agregado.id === id)) {
    //eliminar el servicio agregado
    cita.servicios = servicios.filter((agregado) => agregado.id !== id);
  } else {
    //Agregar el servicio
    cita.servicios = [...servicios, servicio];
  }
  divServicio.classList.toggle("seleccionado");
}

function idCliente() {
  cita.id = document.querySelector("#id").value;
}
function nombreCliente() {
  cita.nombre = document.querySelector("#nombre").value;
}

function fechaCita() {
  const inputFecha = document.querySelector("#fecha");
  inputFecha.addEventListener("input", function (e) {
    const dia = new Date(e.target.value).getUTCDay();
    if ([6, 0].includes(dia)) {
      e.target.value = "";
      mostrarAlertas("Sábados y Domingos cerrados.", "error", ".formulario");
    } else if ([6].includes(dia)) {
      inputHora.value = "";
    } else {
      cita.fecha = e.target.value;
    }
  });
}

function horaCita() {
  const inputHora = document.querySelector("#hora");
  inputHora.addEventListener("input", function (e) {
    const horaCita = e.target.value;
    hora = horaCita.split(":")[0];
    if (hora < 10 || (hora > 13 && hora < 16) || hora > 19) {
      e.target.value = "";
      mostrarAlertas(
        "Selecciona otra Hora, por favor.",
        "error",
        ".formulario"
      );
    } else {
      cita.hora = e.target.value;
    }
  });
}

function mostrarResumen() {
  const resumen = document.querySelector(".contenido-resumen");
  while (resumen.firstChild) {
    resumen.removeChild(resumen.firstChild);
  }

  if (Object.values(cita).includes("") || cita.servicios.length === 0) {
    mostrarAlertas(
      "Selecciona fecha y Hora y al menos un servicio, por favor.",
      "error",
      ".contenido-resumen",
      false
    );
    return;
  }

  //formatear el div de resumen
  const { nombre, fecha, hora, servicios } = cita;

  //Heading para resumen de los servicios
  const headingServicios = document.createElement("H2");
  headingServicios.textContent = "Resumen De La Cita";
  resumen.appendChild(headingServicios);

  const resumenServicios = document.createElement("H3");
  resumenServicios.textContent = "Servicios";
  resumen.appendChild(resumenServicios);

  //Iterar sobre el arreglo de servicios para mostrar los servicios
  servicios.forEach((servicio) => {
    const { id, nombre, precio } = servicio;
    const contenedorSErvicio = document.createElement("DIV");
    contenedorSErvicio.classList.add("contenedor-servicios");
    const textoServicio = document.createElement("p");
    textoServicio.textContent = nombre;
    const precioServicio = document.createElement("p");
    precioServicio.innerHTML = `<span>Precio: </span> ${precio}€`;
    contenedorSErvicio.appendChild(textoServicio);
    contenedorSErvicio.appendChild(precioServicio);
    resumen.appendChild(contenedorSErvicio);
  });

  //Heading para resumen de los servicios
  const headingCita = document.createElement("H3");
  headingCita.textContent = "Datos Cliente";
  resumen.appendChild(headingCita);

  const nombreCliente = document.createElement("p");
  nombreCliente.innerHTML = `<span>Nombre: </span> ${nombre}`;

  //Formatear la fecha en español
  const fechaObj = new Date(fecha);

  const mes = fechaObj.getMonth();
  const dia = fechaObj.getDate();
  const year = fechaObj.getFullYear();

  const fechaUTC = new Date(Date.UTC(year, mes, dia));

  const opciones = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  const fechaFormateada = fechaUTC.toLocaleDateString("es-ES", opciones);

  const fechaCita = document.createElement("p");
  fechaCita.innerHTML = `<span>Fecha: </span> ${fechaFormateada}`;

  const horaCita = document.createElement("p");
  horaCita.innerHTML = `<span>Hora: </span> ${hora}`;

  //Boton para crear citas
  const botonReservar = document.createElement("button");
  botonReservar.classList.add("boton");
  botonReservar.classList.add("reserva");
  botonReservar.textContent = "  Reservar ";
  botonReservar.onclick = reservarCita;

  resumen.appendChild(nombreCliente);
  resumen.appendChild(fechaCita);
  resumen.appendChild(horaCita);

  resumen.appendChild(botonReservar);
}

function mostrarAlertas(mensaje, tipo, elemento, desaparece = true) {
  //evitar que se acumulen las alertas
  const alertPrevia = document.querySelector(".alerta");

  if (alertPrevia) {
    alertPrevia.remove();
  }

  //crear la alerta
  const alerta = document.createElement("DIV");
  alerta.textContent = mensaje;

  alerta.classList.add("alerta");
  alerta.classList.add(tipo);

  const referencia = document.querySelector(elemento);
  referencia.appendChild(alerta);
  //eliminar la alerta
  if (desaparece) {
    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

async function reservarCita() {
  const { nombre, fecha, hora, servicios, id } = cita;

  const idServicios = servicios.map((servicio) => servicio.id);

  const datos = new FormData();

  datos.append("fecha", fecha);
  datos.append("hora", hora);
  datos.append("usuarioId", id);
  datos.append("servicios", idServicios);

  //console.log([...datos]); //Poder ver que datos se mandan en el FormData

  //Petición hacia la api

  //console.log(resultado);

  try {
    const url = "/api/citas";

    const respuesta = await fetch(url, {
      method: "POST",
      body: datos
    });

    const resultado = await respuesta.json();
    if (resultado.resultado) {
      Swal.fire({
        icon: "success",
        title: "Cita Reservada",
        text: "Tu Cita se Reservo Correctamente!"
      }).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Hubo un Error",
      text: "Tu cita no se pudo reservar!"
    }).then(() => {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  }
}
