/* Gestor de predicación - Vanilla JS
   Guarda en localStorage. Permite agregar/editar personas, visitas y textos bíblicos por categoría.
*/
const CATEGORIES = ["Ánimo","Consuelo","Confianza","Fe","Esperanza","Paz","Predicación","Amor","Ansiedad","Enfermedad","Pérdida","Temor","Agradecimiento"];
// Keys
const STORAGE_KEY = "predicacion_data_v1";
const TEXTS_KEY = "predicacion_textos_v1";

let state = { people: [], texts: [] };

function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }

function load(){
  const raw = localStorage.getItem(STORAGE_KEY);
  state = raw ? JSON.parse(raw) : { people:[], texts:[] };
  // ensure texts categories exist
  if(!state.texts || state.texts.length===0){
    state.texts = CATEGORIES.map(c=>({id:uid(),category:c,items:[]}));
  }
  renderFilters();
  renderList();
}

function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

document.addEventListener("DOMContentLoaded",()=>{
  // elements
  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.getElementById("sidebar");
  const newPersonBtn = document.getElementById("newPersonBtn");
  const peopleList = document.getElementById("peopleList");
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modalContent");
  const manageTextsBtn = document.getElementById("manageTextsBtn");
  const search = document.getElementById("search");
  const sort = document.getElementById("sort");
  const backupBtn = document.getElementById("backupBtn");
  const importBtn = document.getElementById("importBtn");

  menuBtn.addEventListener("click",()=> sidebar.classList.toggle("hidden"));
  newPersonBtn.addEventListener("click",()=> openPersonModal());
  manageTextsBtn.addEventListener("click",()=> openManageTexts());
  backupBtn.addEventListener("click", exportBackup);
  importBtn.addEventListener("click", ()=> openImportModal());
  search.addEventListener("input", renderList);
  sort.addEventListener("change", renderList);

  modal.addEventListener("click",(e)=>{ if(e.target===modal) closeModal(); });
  load();
});

function renderFilters(){
  const container = document.getElementById("filters");
  container.innerHTML = "";
  state.texts.forEach(t=>{
    const btn = document.createElement("button");
    btn.className = "cardBtn";
    btn.textContent = t.category;
    btn.onclick = ()=> { applyFilter(t.category); };
    container.appendChild(btn);
  });
  const clear = document.createElement("button");
  clear.className = "cardBtn";
  clear.textContent = "Mostrar todo";
  clear.onclick = ()=> { applyFilter(null); };
  container.appendChild(document.createElement("hr"));
  container.appendChild(clear);
}

let activeFilter = null;
function applyFilter(cat){
  activeFilter = cat;
  renderList();
}

function renderList(){
  const list = document.getElementById("peopleList");
  list.innerHTML = "";
  const q = document.getElementById("search").value.toLowerCase();
  let people = state.people.slice();
  const sortBy = document.getElementById("sort").value;
  if(sortBy==="nextVisit"){
    people.sort((a,b)=>{
      const A = a.nextVisit||"9999-12-31", B = b.nextVisit||"9999-12-31";
      return A.localeCompare(B);
    });
  } else {
    people.sort((a,b)=> (a.name||"").localeCompare(b.name||""));
  }
  people.forEach(p=>{
    if(q && !(p.name||"").toLowerCase().includes(q) && !(p.address||"").toLowerCase().includes(q)) return;
    if(activeFilter){
      const has = (p.visits||[]).some(v=> (v.bibTexts||[]).some(bt=> bt.category===activeFilter));
      if(!has) return;
    }
    const card = document.createElement("div"); card.className="person";
    card.innerHTML = `<div class="person-header"><h3>${escapeHtml(p.name||"Sin nombre")}</h3><span class="badge">${p.city||""}</span></div>
      <p class="small">${escapeHtml(p.address||"")}</p>
      <p class="small">Tel: ${escapeHtml(p.phone||"")}</p>
      <div class="meta"><span class="small">Próx: ${p.nextVisit||"-"}</span>
      <div><button class="cardBtn" onclick="viewPerson('${p.id}')">Ver</button>
      <button class="cardBtn" onclick="quickWhats('${p.id}')">Whats</button></div></div>`;
    list.appendChild(card);
  });
}

function openModal(contentHtml){
  const modal = document.getElementById("modal");
  const content = document.getElementById("modalContent");
  content.innerHTML = contentHtml;
  modal.classList.remove("hidden");
}
function closeModal(){
  document.getElementById("modal").classList.add("hidden");
}

function openPersonModal(person){
  const p = person || {id:uid(),name:"",address:"",city:"",phone:"",notes:"",needs:"",visits:[],nextVisit:""};
  const html = `<h3>${person ? "Editar persona":"Nueva persona"}</h3>
  <div class="form-row"><input id="p_name" placeholder="Nombre completo" value="${escapeHtml(p.name||"")}"/></div>
  <div class="form-row"><input id="p_city" placeholder="Ciudad / Barrio" value="${escapeHtml(p.city||"")}"/> <input id="p_address" placeholder="Dirección" value="${escapeHtml(p.address||"")}"/></div>
  <div class="form-row"><input id="p_phone" placeholder="Teléfono" value="${escapeHtml(p.phone||"")}"/> <input id="p_nextVisit" placeholder="Próxima visita (YYYY-MM-DD)" value="${escapeHtml(p.nextVisit||"")}"/></div>
  <div class="form-row"><textarea id="p_notes" placeholder="Observaciones...">${escapeHtml(p.notes||"")}</textarea></div>
  <div style="text-align:right"><button onclick="savePerson('${p.id}')">Guardar</button> <button onclick="closeModal()">Cancelar</button></div>`;
  openModal(html);
}

function savePerson(id){
  const name = document.getElementById("p_name").value.trim();
  if(!name){ alert("El nombre es obligatorio."); return; }
  const personIndex = state.people.findIndex(x=>x.id===id);
  const obj = {
    id,
    name,
    city: document.getElementById("p_city").value.trim(),
    address: document.getElementById("p_address").value.trim(),
    phone: document.getElementById("p_phone").value.trim(),
    notes: document.getElementById("p_notes").value.trim(),
    needs: "",
    visits: [],
    nextVisit: document.getElementById("p_nextVisit").value.trim()
  };
  if(personIndex===-1) state.people.push(obj); else state.people[personIndex]=Object.assign(state.people[personIndex],obj);
  save(); closeModal(); renderList();
}

function viewPerson(id){
  const p = state.people.find(x=>x.id===id);
  if(!p) return alert("Persona no encontrada.");
  document.getElementById("listView").classList.add("hidden");
  document.getElementById("personView").classList.remove("hidden");
  document.getElementById("sidebar").classList.add("hidden");
  renderPersonCard(p);
}

function renderPersonCard(p){
  const card = document.getElementById("personCard");
  card.innerHTML = `<h2>${escapeHtml(p.name)}</h2>
    <p class="small">${escapeHtml(p.city)} · ${escapeHtml(p.address)}</p>
    <p class="small">Tel: ${escapeHtml(p.phone)}</p>
    <p>${escapeHtml(p.notes)}</p>`;
  document.getElementById("editPersonBtn").onclick = ()=> openPersonModal(p);
  document.getElementById("exportPersonBtn").onclick = ()=> exportPerson(p);
  document.getElementById("backList").onclick = ()=> { document.getElementById("personView").classList.add("hidden"); document.getElementById("listView").classList.remove("hidden"); renderList(); }
  document.getElementById("addVisitBtn").onclick = ()=> openVisitModal(p);
  document.getElementById("whatsappLink").href = whatsappUrlFor(p);
  renderVisits(p);
}

function renderVisits(p){
  const container = document.getElementById("visitsList");
  container.innerHTML = "<h3>Visitas</h3>";
  (p.visits||[]).forEach((v,idx)=>{
    const div = document.createElement("div"); div.className="visit";
    div.innerHTML = `<div style="display:flex;justify-content:space-between"><strong>${v.date}</strong><span class="small">Próx: ${v.nextDate||"-"}</span></div>
      <div class="small">${escapeHtml(v.note||"")}</div>
      <div class="small">Textos: ${ (v.bibTexts||[]).map(bt=>bt.category).join(", ") }</div>
      <div style="margin-top:6px"><button onclick="editVisit('${p.id}',${idx})" class="cardBtn">Editar</button> <button onclick="deleteVisit('${p.id}',${idx})" class="cardBtn">Eliminar</button></div>`;
    container.appendChild(div);
  });
  if((p.visits||[]).length===0) container.innerHTML += "<p class='small'>No hay visitas registradas.</p>";
}

function openVisitModal(person){
  const p = person;
  const html = `<h3>Nueva visita para ${escapeHtml(p.name)}</h3>
  <div class="form-row"><input id="v_date" placeholder="Fecha (YYYY-MM-DD)"/></div>
  <div class="form-row"><input id="v_nextDate" placeholder="Próxima fecha (YYYY-MM-DD)"/></div>
  <div class="form-row"><textarea id="v_note" placeholder="Observaciones de la visita"></textarea></div>
  <div><label class="small">Seleccionar textos bíblicos (puedes crear y asignar en 'Administrar textos'):</label></div>
  <div id="selectTextsArea"></div>
  <div style="text-align:right;margin-top:8px"><button onclick="saveVisit('${p.id}','new')">Guardar visita</button> <button onclick="closeModal()">Cancelar</button></div>`;
  openModal(html);
  // populate texts
  const area = document.getElementById("selectTextsArea");
  state.texts.forEach(t=>{
    const opt = document.createElement("div");
    opt.innerHTML = `<strong>${t.category}</strong><div class="small">${t.items.slice(0,3).map(i=>i.text.slice(0,60)).join(" — ")}</div>`;
    area.appendChild(opt);
  });
}

function saveVisit(personId, mode, idx){
  const p = state.people.find(x=>x.id===personId);
  if(!p) return;
  const v = {
    date: document.getElementById("v_date").value || "",
    nextDate: document.getElementById("v_nextDate").value || "",
    note: document.getElementById("v_note").value || "",
    bibTexts: [] // user will assign manually later
  };
  if(mode==="new") p.visits = p.visits||[], p.visits.push(v);
  else p.visits[idx] = v;
  // update nextVisit on person if provided
  if(v.nextDate) p.nextVisit = v.nextDate;
  save(); closeModal(); renderPersonCard(p);
}

function deleteVisit(pid, idx){
  if(!confirm("Eliminar visita?")) return;
  const p = state.people.find(x=>x.id===pid);
  p.visits.splice(idx,1); save(); renderPersonCard(p);
}

function editVisit(pid, idx){
  const p = state.people.find(x=>x.id===pid);
  const v = p.visits[idx];
  const html = `<h3>Editar visita ${v.date}</h3>
  <div class="form-row"><input id="v_date" value="${v.date}"/></div>
  <div class="form-row"><input id="v_nextDate" value="${v.nextDate||""}"/></div>
  <div class="form-row"><textarea id="v_note">${escapeHtml(v.note||"")}</textarea></div>
  <div style="text-align:right;margin-top:8px"><button onclick="saveVisit('${p.id}','edit',${idx})">Guardar</button> <button onclick="closeModal()">Cancelar</button></div>`;
  openModal(html);
}

function exportPerson(p){
  const data = JSON.stringify(p, null, 2);
  const blob = new Blob([data],{type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `${sanitizeFilename(p.name||"persona")}.json`; a.click();
  URL.revokeObjectURL(url);
}

function exportBackup(){
  const data = JSON.stringify(state, null, 2);
  const blob = new Blob([data],{type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `predicacion_backup_${new Date().toISOString().slice(0,10)}.json`; a.click();
  URL.revokeObjectURL(url);
}

function openManageTexts(){
  const html = `<h3>Administrar textos bíblicos</h3>
    <div id="textsArea"></div>
    <div style="margin-top:8px"><button onclick="openAddTextModal()">+ Agregar texto</button> <button onclick="closeModal()">Cerrar</button></div>`;
  openModal(html);
  renderTextsArea();
}

function renderTextsArea(){
  const area = document.getElementById("textsArea");
  area.innerHTML = "";
  state.texts.forEach(t=>{
    const div = document.createElement("div"); div.style.marginBottom="10px";
    div.innerHTML = `<strong>${t.category}</strong> <span class="small">(${t.items.length})</span>
      <div class="small">${t.items.slice(0,4).map(i=>escapeHtml(i.text).slice(0,120)).join(" — ")}</div>
      <div style="margin-top:6px"><button class="cardBtn" onclick='openListFor("${t.id}")'>Ver/Editar</button></div>`;
    area.appendChild(div);
  });
}

function openListFor(categoryId){
  const cat = state.texts.find(t=>t.id===categoryId);
  let html = `<h3>Textos: ${cat.category}</h3><div id="catList">`;
  cat.items.forEach((it,idx)=>{
    html += `<div style="padding:8px;border-radius:8px;border:1px solid #eef5ff;margin-bottom:6px"><div class="small">${escapeHtml(it.text)}</div>
    <div style="margin-top:6px"><button class="cardBtn" onclick='deleteText("${cat.id}",${idx})'>Eliminar</button></div></div>`;
  });
  html += `</div><div style="text-align:right;margin-top:8px"><button onclick='closeModal()'>Cerrar</button></div>`;
  openModal(html);
}

function openAddTextModal(){
  let options = state.texts.map(t=>`<option value="${t.id}">${t.category}</option>`).join("");
  const html = `<h3>Agregar texto bíblico</h3>
    <div class="form-row"><select id="textCat">${options}</select></div>
    <div class="form-row"><textarea id="textContent" placeholder="Pega aquí el versículo o tu comentario (respeta derechos de autor)"></textarea></div>
    <div style="text-align:right"><button onclick="saveText()">Agregar</button> <button onclick="closeModal()">Cancelar</button></div>`;
  openModal(html);
}

function saveText(){
  const catId = document.getElementById("textCat").value;
  const text = document.getElementById("textContent").value.trim();
  if(!text) return alert("Escribe el texto primero.");
  const cat = state.texts.find(t=>t.id===catId);
  cat.items.unshift({id:uid(),text});
  save(); closeModal(); renderTextsArea();
}

function deleteText(catId, idx){
  if(!confirm("Eliminar texto?")) return;
  const cat = state.texts.find(t=>t.id===catId);
  cat.items.splice(idx,1); save(); renderTextsArea();
}

function openImportModal(){
  const html = `<h3>Importar backup JSON</h3><input type="file" id="fileInput" accept="application/json"/>
    <div style="text-align:right;margin-top:8px"><button onclick="doImport()">Importar</button> <button onclick="closeModal()">Cancelar</button></div>`;
  openModal(html);
}

function doImport(){
  const f = document.getElementById("fileInput").files[0];
  if(!f) return alert("Selecciona un archivo JSON.");
  const reader = new FileReader();
  reader.onload = e=>{
    try{
      const parsed = JSON.parse(e.target.result);
      if(parsed.people) state = parsed;
      else if(parsed.people===undefined && parsed.people===undefined) state = parsed;
      save(); closeModal(); load();
      alert("Importado correctamente.");
    }catch(err){ alert("Archivo inválido."); }
  };
  reader.readAsText(f);
}

function quickWhats(pid){
  const p = state.people.find(x=>x.id===pid);
  const url = whatsappUrlFor(p);
  window.open(url,"_blank");
}

function whatsappUrlFor(p){
  const phone = (p.phone||"").replace(/\s|\-|\(|\)/g,"");
  const text = encodeURIComponent(`Hola ${p.name}, te saluda tu hermano. ¿Podemos coordinar la próxima visita?`);
  if(!phone) return "https://wa.me/";
  return `https://wa.me/${phone}?text=${text}`;
}

function escapeHtml(s){ if(!s) return ""; return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function sanitizeFilename(n){ return n.replace(/[^\w\-]/g,"_"); }

// expose some functions to global because we used inline onclicks
window.viewPerson = viewPerson;
window.openPersonModal = openPersonModal;
window.savePerson = savePerson;
window.openVisitModal = openVisitModal;
window.saveVisit = saveVisit;
window.editVisit = editVisit;
window.deleteVisit = deleteVisit;
window.exportPerson = exportPerson;
window.openManageTexts = openManageTexts;
window.openAddTextModal = openAddTextModal;
window.deleteText = deleteText;
window.openListFor = openListFor;
window.openImportModal = openImportModal;
window.exportBackup = exportBackup;
