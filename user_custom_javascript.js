/* @odoo-module */
//
// This file is meant to regroup your javascript code. You can either copy/past
// any code that should be executed on each page loading or write your own
// taking advantage of the Odoo framework to create new behaviors or modify
// existing ones. For example, doing this will greet any visitor with a 'Hello,
// world !' message in a popup:
//
/*
import { ConfirmationDialog } from '@web/core/confirmation_dialog/confirmation_dialog';
import { Interaction } from "@web/public/interaction";
import { registry } from "@web/core/registry";

class HelloWorldPopup extends Interaction {
    static selector = "#wrapwrap";

    start() {
        this.services.dialog.add(ConfirmationDialog, { body: "hello world"});
    }
}

registry
    .category("public.interactions")
    .add("website.hello_world_popup", HelloWorldPopup);
*/
/*CALCULADORA CUOTAS TARJETA*/


(function(){
  const $ = (id) => document.getElementById(id);

  function round2(n){ return Math.round((Number(n) || 0) * 100) / 100; }

  function money(n){
    const v = Math.max(0, Number(n) || 0);
    return "$ " + v.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2});
  }

  function setText(id, value){
    const el = $(id);
    if (el) el.textContent = value;
  }

  function setValue(id, value){
    const el = $(id);
    if (el) el.value = value;
  }

  function calcular(){
    // Si este JS carga en otras páginas, evita errores
    if(!$("tt_producto") || !$("tt_subtotal") || !$("tt_iva") || !$("tt_entrada")) return;

    const producto = ($("tt_producto").value || "Producto").trim();
    const subtotal = Number($("tt_subtotal").value);
    const ivaRate = Number($("tt_iva").value);
    const entrada = Number($("tt_entrada").value || 0);

    if(!subtotal || subtotal <= 0){
      alert("Ingrese un subtotal válido.");
      return;
    }
    if(entrada < 0){
      alert("La entrada no puede ser negativa.");
      return;
    }

    const iva = round2(subtotal * ivaRate);
    const total = round2(subtotal + iva);
    const saldo = round2(Math.max(0, total - entrada));

    // % EXACTOS (sobre saldo)
    const totCorr = round2(saldo * 1.08);   // Corriente +8%
    const tot3 = round2(saldo * 1.12);      // 3 meses +12%
    const tot6 = round2(saldo * 1.165);     // 6 meses +16.5%
    const tot12 = round2(saldo * 1.20);     // 12 meses +20%

    const c3 = round2(tot3 / 3);
    const c6 = round2(tot6 / 6);
    const c12 = round2(tot12 / 12);

    // Labels IVA en screenshot
    setText("tt_iva_label", (ivaRate === 0 ? "0%" : "15%"));

    // Screenshot values
    setText("tt_producto_screenshot", producto);
    setText("tt_subtotal_view", money(subtotal));
    setText("tt_iva_view", money(iva));
    setText("tt_total_view", money(total));
    setText("tt_entrada_view", money(entrada));
    setText("tt_saldo_view", money(saldo));

    setText("tt_sc_corr", money(totCorr));
    setText("tt_sc_3", money(tot3));
    setText("tt_sc_c3", money(c3));
    setText("tt_sc_6", money(tot6));
    setText("tt_sc_c6", money(c6));
    setText("tt_sc_12", money(tot12));
    setText("tt_sc_c12", money(c12));

    // Mensaje WhatsApp
    const ivaTxt = (ivaRate === 0 ? "0%" : "15%");
    const msg =
`📌 ${producto}
• Subtotal: ${money(subtotal)}
• IVA: ${ivaTxt} (${money(iva)})
• Total (Efec/Transf): ${money(total)}
• Entrada: ${money(entrada)}
• Saldo: ${money(saldo)}

💳 Tarjeta (sobre el saldo):
• Corriente (8%): ${money(totCorr)}
• 3 meses: ${money(tot3)} | Cuota: ${money(c3)}
• 6 meses: ${money(tot6)} | Cuota: ${money(c6)}
• 12 meses: ${money(tot12)} | Cuota: ${money(c12)}

*Valores referenciales.`;

    setValue("tt_mensaje", msg);
    setText("tt_copyStatus", "");
  }

  function limpiar(){
    if(!$("tt_producto")) return;

    $("tt_producto").value = "EQUIPO A COTIZAR";
    $("tt_subtotal").value = "";
    $("tt_entrada").value = "0";
    $("tt_iva").value = "0.15";

    // Limpia textos visibles (dejamos guiones)
    [
      "tt_subtotal_view","tt_iva_view","tt_total_view",
      "tt_entrada_view","tt_saldo_view",
      "tt_sc_corr","tt_sc_3","tt_sc_c3","tt_sc_6","tt_sc_c6","tt_sc_12","tt_sc_c12"
    ].forEach(id => setText(id, "—"));

    setText("tt_producto_screenshot", "EQUIPO A COTIZAR");
    setText("tt_iva_label", "15%");

    setValue("tt_mensaje", "");
    setText("tt_copyStatus", "");
  }

  async function copiar(){
    if(!$("tt_mensaje")) return;
    try{
      await navigator.clipboard.writeText($("tt_mensaje").value || "");
      setText("tt_copyStatus", "✅ Copiado");
      setTimeout(()=> setText("tt_copyStatus",""), 1200);
    }catch(e){
      setText("tt_copyStatus", "No se pudo copiar (permiso del navegador).");
    }
  }

  function wire(){
    if(!$("tt_btnCalcular")) return;

    $("tt_btnCalcular").addEventListener("click", calcular);
    $("tt_btnLimpiar").addEventListener("click", limpiar);
    $("tt_btnCopiar").addEventListener("click", copiar);

    ["tt_producto","tt_subtotal","tt_entrada"].forEach(id=>{
      const el = $(id);
      if(el){
        el.addEventListener("keydown",(e)=>{ if(e.key === "Enter") calcular(); });
      }
    });

    const ivaSel = $("tt_iva");
    if (ivaSel) ivaSel.addEventListener("change", calcular);

    // Inicial
    calcular();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", wire);
  }else{
    wire();
  }
})();

/* ==========================================================
   TITAN TECH - MARCAS (Micro-Reveal)
   - Sin auto-scroll
   - Activa animación al entrar en viewport (una sola vez)
========================================================== */
document.addEventListener('DOMContentLoaded', function () {
  const brandsSection = document.querySelector('.tt_brands');
  if (!brandsSection) return;

  const reveal = () => brandsSection.classList.add('tt-reveal');

  if (!('IntersectionObserver' in window)) {
    reveal();
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      reveal();
      io.disconnect();
    });
  }, { threshold: 0.15 });

  io.observe(brandsSection);
});
