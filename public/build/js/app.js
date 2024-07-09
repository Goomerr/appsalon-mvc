let paso = 1;
const pasoInicial = 1,
  pasoFinal = 3,
  cita = { id: "", nombre: "", fecha: "", hora: "", servicios: [] };
function iniciarApp() {
  mostrarSeccion(),
    tabs(),
    botonesPaginador(),
    paginaSiguiente(),
    paginaAnterior(),
    consultarApi(),
    idCliente(),
    nombreCliente(),
    fechaCita(),
    horaCita(),
    mostrarResumen();
}
function mostrarSeccion() {
  const e = document.querySelector(".mostrar");
  e && e.classList.remove("mostrar");
  const t = `#paso-${paso}`;
  document.querySelector(t).classList.add("mostrar");
  document.querySelector(".actual").classList.remove("actual");
  document.querySelector(`[data-paso="${paso}"]`).classList.add("actual");
}
function tabs() {
  document.querySelectorAll(".tabs button").forEach((e) => {
    e.addEventListener("click", function (e) {
      (paso = parseInt(e.target.dataset.paso)),
        mostrarSeccion(),
        botonesPaginador();
    });
  });
}
function botonesPaginador() {
  const e = document.querySelector("#anterior"),
    t = document.querySelector("#siguiente");
  1 === paso
    ? (e.classList.add("ocultar"), t.classList.remove("ocultar"))
    : 3 === paso
    ? (e.classList.remove("ocultar"),
      t.classList.add("ocultar"),
      mostrarResumen())
    : (t.classList.remove("ocultar"), e.classList.remove("ocultar")),
    mostrarSeccion();
}
function paginaAnterior() {
  document.querySelector("#anterior").addEventListener("click", function () {
    paso <= pasoInicial || (paso--, botonesPaginador());
  });
}
function paginaSiguiente() {
  document.querySelector("#siguiente").addEventListener("click", function () {
    paso >= pasoFinal || (paso++, botonesPaginador());
  });
}
async function consultarApi() {
  try {
    const e = "/api/servicios",
      t = await fetch(e);
    mostrarServicios(await t.json(t));
  } catch (e) {
    console.log(e);
  }
}
function mostrarServicios(e) {
  e.forEach((e) => {
    const { id: t, nombre: o, precio: a } = e,
      n = document.createElement("P");
    n.classList.add("nombre-servicio"), (n.textContent = o);
    const r = document.createElement("P");
    r.classList.add("precio-servicio"), (r.textContent = `${a}€`);
    const c = document.createElement("DIV");
    c.classList.add("servicio"),
      (c.dataset.idServicio = t),
      (c.onclick = function () {
        seleccionarServicio(e);
      }),
      c.appendChild(n),
      c.appendChild(r),
      document.querySelector("#servicios").appendChild(c);
  });
}
function seleccionarServicio(e) {
  const { id: t } = e,
    { servicios: o } = cita,
    a = document.querySelector(`[data-id-servicio="${t}"]`);
  o.some((e) => e.id === t)
    ? (cita.servicios = o.filter((e) => e.id !== t))
    : (cita.servicios = [...o, e]),
    a.classList.toggle("seleccionado");
}
function idCliente() {
  cita.id = document.querySelector("#id").value;
}
function nombreCliente() {
  cita.nombre = document.querySelector("#nombre").value;
}
function fechaCita() {
  document.querySelector("#fecha").addEventListener("input", function (e) {
    const t = new Date(e.target.value).getUTCDay();
    [6, 0].includes(t)
      ? ((e.target.value = ""),
        mostrarAlertas("Sábados y Domingos cerrados.", "error", ".formulario"))
      : [6].includes(t)
      ? (inputHora.value = "")
      : (cita.fecha = e.target.value);
  });
}
function horaCita() {
  document.querySelector("#hora").addEventListener("input", function (e) {
    const t = e.target.value;
    (hora = t.split(":")[0]),
      hora < 10 || (hora > 13 && hora < 16) || hora > 19
        ? ((e.target.value = ""),
          mostrarAlertas(
            "Selecciona otra Hora, por favor.",
            "error",
            ".formulario"
          ))
        : (cita.hora = e.target.value);
  });
}
function mostrarResumen() {
  const e = document.querySelector(".contenido-resumen");
  for (; e.firstChild; ) e.removeChild(e.firstChild);
  if (Object.values(cita).includes("") || 0 === cita.servicios.length)
    return void mostrarAlertas(
      "Selecciona fecha y Hora y al menos un servicio, por favor.",
      "error",
      ".contenido-resumen",
      !1
    );
  const { nombre: t, fecha: o, hora: a, servicios: n } = cita,
    r = document.createElement("H2");
  (r.textContent = "Resumen De La Cita"), e.appendChild(r);
  const c = document.createElement("H3");
  (c.textContent = "Servicios"),
    e.appendChild(c),
    n.forEach((t) => {
      const { id: o, nombre: a, precio: n } = t,
        r = document.createElement("DIV");
      r.classList.add("contenedor-servicios");
      const c = document.createElement("p");
      c.textContent = a;
      const i = document.createElement("p");
      (i.innerHTML = `<span>Precio: </span> ${n}€`),
        r.appendChild(c),
        r.appendChild(i),
        e.appendChild(r);
    });
  const i = document.createElement("H3");
  (i.textContent = "Datos Cliente"), e.appendChild(i);
  const s = document.createElement("p");
  s.innerHTML = `<span>Nombre: </span> ${t}`;
  const d = new Date(o),
    l = d.getMonth(),
    u = d.getDate(),
    m = d.getFullYear(),
    p = new Date(Date.UTC(m, l, u)).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }),
    h = document.createElement("p");
  h.innerHTML = `<span>Fecha: </span> ${p}`;
  const v = document.createElement("p");
  v.innerHTML = `<span>Hora: </span> ${a}`;
  const f = document.createElement("button");
  f.classList.add("boton"),
    f.classList.add("reserva"),
    (f.textContent = "  Reservar "),
    (f.onclick = reservarCita),
    e.appendChild(s),
    e.appendChild(h),
    e.appendChild(v),
    e.appendChild(f);
}
function mostrarAlertas(e, t, o, a = !0) {
  const n = document.querySelector(".alerta");
  n && n.remove();
  const r = document.createElement("DIV");
  (r.textContent = e), r.classList.add("alerta"), r.classList.add(t);
  document.querySelector(o).appendChild(r),
    a &&
      setTimeout(() => {
        r.remove();
      }, 3e3);
}
async function reservarCita() {
  const { nombre: e, fecha: t, hora: o, servicios: a, id: n } = cita,
    r = a.map((e) => e.id),
    c = new FormData();
  c.append("fecha", t),
    c.append("hora", o),
    c.append("usuarioId", n),
    c.append("servicios", r);
  try {
    const e = "/api/citas",
      t = await fetch(e, { method: "POST", body: c });
    (await t.json()).resultado &&
      Swal.fire({
        icon: "success",
        title: "Cita Reservada",
        text: "Tu Cita se Reservo Correctamente!"
      }).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 1e3);
      });
  } catch (e) {
    Swal.fire({
      icon: "error",
      title: "Hubo un Error",
      text: "Tu cita no se pudo reservar!"
    }).then(() => {
      setTimeout(() => {
        window.location.reload();
      }, 1e3);
    });
  }
}
document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
});
