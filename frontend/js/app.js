/* Painel da barbearia — JavaScript puro, servido pelo próprio Express (mesma origem que a API). */
"use strict";
const $ = (s) => document.querySelector(s), enc = encodeURIComponent;
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const brl = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dt = (v) => new Date(v).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
const hm = (v) => new Date(v).toLocaleTimeString('pt-BR', { timeStyle: 'short' });
const today = (d) => new Date(d).toDateString() === new Date().toDateString();
const loc = (v) => { const d = new Date(v); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); };
const ST = ['agendado', 'finalizado', 'cancelado'], LB = { agendado: 'Agendados', finalizado: 'Finalizados', cancelado: 'Cancelados' };
const PM = { dinheiro: 'Dinheiro', pix: 'Pix', credito: 'Crédito', debito: 'Débito' };
const BASE = ''; // mesma origem: o Express serve o frontend e a API
const S = { cats: [], svcs: [], apps: [] };
let P = JSON.parse(localStorage.bsPay || '[]');
const savePay = () => localStorage.bsPay = JSON.stringify(P);
const n = (o) => ({ ...o, category_id: o.category_id ?? o.categoryId, estimated_minutes: o.estimated_minutes ?? o.estimatedMinutes, is_active: o.is_active ?? o.isActive ?? true, service_id: o.service_id ?? o.serviceId, client_name: o.client_name ?? o.clientName, client_phone: o.client_phone ?? o.clientPhone, date_time: o.date_time ?? o.dateTime });
const list = (r) => (Array.isArray(r) ? r : r.data ?? []).map(n);
const svc = (id) => S.svcs.find(s => s.id === id), cat = (id) => S.cats.find(c => c.id === id);
const paid = (id) => P.find(p => p.appId === id);
async function api(p, m = 'GET', b) {
    const r = await fetch(BASE + p, { method: m, headers: { 'Content-Type': 'application/json' }, body: b ? JSON.stringify(b) : undefined });
    let j = {};
    try {
        j = await r.json();
    }
    catch { }
    if (!r.ok)
        throw new Error(j.error || j.message || 'Erro ' + r.status);
    return j;
}
function toast(m, e) { const d = document.createElement('div'); d.textContent = m; if (e)
    d.className = 'e'; $('#toast').append(d); setTimeout(() => d.remove(), 3500); }
async function load() {
    try {
        const [c, s, a] = await Promise.all(['/categories', '/services', '/appointments'].map(p => api(p)));
        S.cats = list(c);
        S.svcs = list(s);
        S.apps = list(a);
        $('#dot').className = 'dot ok';
        $('#conn').textContent = 'API online';
        SV.list = CT.list = null;
    }
    catch (e) {
        $('#dot').className = 'dot no';
        $('#conn').textContent = 'API offline';
        toast('Sem conexão com a API', 1);
    }
    render();
}
const closeDlg = () => $('#dlg').close();
function openForm(title, fields, save, v = {}) {
    $('#dlg').innerHTML = `<form><h3 style="margin-bottom:12px">${title}</h3>${fields.map(f => `<label>${f.l}${f.t === 'select' ? `<select name="${f.k}" ${f.r ? 'required' : ''}>${f.o.map(o => `<option value="${esc(o[0])}" ${String(v[f.k]) === String(o[0]) ? 'selected' : ''}>${esc(o[1])}</option>`).join('')}</select>`
        : f.t === 'area' ? `<textarea name="${f.k}" rows="3">${esc(v[f.k])}</textarea>`
            : `<input name="${f.k}" type="${f.t || 'text'}" value="${esc(v[f.k])}" ${f.r ? 'required' : ''} ${f.x || ''}>`}</label>`).join('')}
    <div class="row"><button type="button" onclick="closeDlg()">Cancelar</button><button class="pri">Salvar</button></div></form>`;
    const fm = $('#dlg form');
    fm.onsubmit = async (e) => { e.preventDefault(); try {
        await save(Object.fromEntries(new FormData(fm)));
        closeDlg();
        await load();
    }
    catch (x) {
        toast(x.message, 1);
    } };
    $('#dlg').showModal();
}
async function del(path, msg) { if (!confirm(msg))
    return; try {
    await api(path, 'DELETE');
    toast('Removido');
    load();
}
catch (e) {
    toast(e.message, 1);
} }
let tm;
const debounce = (f) => { clearTimeout(tm); tm = setTimeout(f, 300); };
let D = { p: 'hoje', st: '' };
function dashboard() {
    const as = S.apps.filter(a => D.p === 'todos' || today(a.date_time)).sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime());
    const pays = P.filter(p => D.p === 'todos' || today(p.at)), rev = pays.reduce((t, p) => t + p.t, 0), dsc = pays.reduce((t, p) => t + p.d, 0);
    const card = (a) => {
        const s = svc(a.service_id), pg = paid(a.id);
        return `<article class="card"><b>${D.p === 'todos' ? dt(a.date_time) : hm(a.date_time)} · ${esc(a.client_name)}</b>
    <span class="mut">${esc(s?.name || 'Serviço removido')} · ${brl(s?.price)}</span>${pg ? `<span class="mut">Pago: ${PM[pg.m]} · ${brl(pg.t)}</span>` : ''}
    <div class="r">${a.status === 'agendado' ? `<button class="sm pri" onclick="goPay('${a.id}')">Receber</button><button class="sm" onclick="wa('${a.id}')">Lembrar</button><button class="sm dng" onclick="setSt('${a.id}','cancelado')">Cancelar</button>` : ''}
    ${a.status === 'finalizado' && !pg ? `<button class="sm pri" onclick="goPay('${a.id}')">Receber</button>` : ''}
    ${a.status === 'cancelado' ? `<button class="sm" onclick="setSt('${a.id}','agendado')">Reabrir</button>` : ''}</div></article>`;
    };
    return `<h2>Atendimentos</h2>
  <div class="bar"><select onchange="D.p=this.value;render()"><option value="hoje" ${D.p === 'hoje' ? 'selected' : ''}>Hoje</option><option value="todos" ${D.p === 'todos' ? 'selected' : ''}>Todos os dias</option></select>
  <span class="mut">${D.st ? `Filtrando: ${LB[D.st]}` : ''}</span><span class="sp"></span><button class="pri" onclick="formApp()">Novo agendamento</button></div>
  <div class="stats">${ST.map(s => `<button class="stat ${s} ${D.st === s ? 'on' : ''}" onclick="D.st=D.st==='${s}'?'':'${s}';render()"><div class="mut">${LB[s]}</div><div class="num">${as.filter(a => a.status === s).length}</div></button>`).join('')}
  <div class="box stat" style="border-top-color:var(--acc)"><div class="mut">Faturamento</div><div class="num">${brl(rev)}</div><div class="mut">${brl(dsc)} em descontos</div></div></div>
  <div class="board">${ST.filter(s => !D.st || D.st === s).map(s => { const l = as.filter(a => a.status === s); return `<section class="col"><h3><span class="badge ${s}">${LB[s]}</span></h3>${l.map(card).join('') || '<p class="mut">Nada por aqui.</p>'}</section>`; }).join('')}</div>`;
}
async function setSt(id, status) { try {
    await api(`/appointments/${id}/status`, 'PATCH', { status });
    load();
}
catch (e) {
    toast(e.message, 1);
} }
function wa(id) {
    const a = S.apps.find(x => x.id === id), s = svc(a.service_id);
    let t = (a.client_phone || '').replace(/\D/g, '');
    if (!t.startsWith('55'))
        t = '55' + t;
    open(`https://wa.me/${t}?text=${enc(`Olá, ${a.client_name}! Lembrete do seu horário (${s?.name || 'atendimento'}) em ${dt(a.date_time)}. Até lá!`)}`, '_blank');
}
function goPay(id) { pick(id); location.hash = 'cashier'; }
let AP = { st: '', q: '' };
function apRows() {
    const q = AP.q.toLowerCase(), l = S.apps.filter(a => (!AP.st || a.status === AP.st) && (!q || (a.client_name + a.client_phone).toLowerCase().includes(q))).sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime());
    return l.map(a => `<tr><td>${esc(a.client_name)}<div class="mut">${esc(a.client_phone)}</div></td><td>${esc(svc(a.service_id)?.name || '—')}</td><td>${dt(a.date_time)}</td>
  <td><select aria-label="Status" onchange="setSt('${a.id}',this.value)">${ST.map(s => `<option ${a.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select></td>
  <td class="act"><button class="sm" onclick="formApp('${a.id}')">Editar</button><button class="sm dng" onclick="del('/appointments/${a.id}','Excluir este agendamento?')">Excluir</button></td></tr>`).join('') || '<tr><td colspan="5" class="mut">Nenhum agendamento encontrado.</td></tr>';
}
function appointments() {
    return `<h2>Agendamentos</h2><div class="bar"><input placeholder="Buscar cliente ou telefone" value="${esc(AP.q)}" oninput="AP.q=this.value;$('#tb').innerHTML=apRows()">
  <select onchange="AP.st=this.value;$('#tb').innerHTML=apRows()"><option value="">Todos os status</option>${ST.map(s => `<option ${AP.st === s ? 'selected' : ''}>${s}</option>`).join('')}</select><span class="sp"></span><button class="pri" onclick="formApp()">Novo agendamento</button></div>
  <div class="tw"><table><thead><tr><th>Cliente</th><th>Serviço</th><th>Data</th><th>Status</th><th></th></tr></thead><tbody id="tb">${apRows()}</tbody></table></div>`;
}
function formApp(id) {
    const a = id ? S.apps.find(x => x.id === id) : undefined;
    openForm(a ? 'Editar agendamento' : 'Novo agendamento', [
        { k: 'service_id', l: 'Serviço', t: 'select', r: 1, o: S.svcs.filter(s => s.is_active || s.id === a?.service_id).map(s => [s.id, `${s.name} · ${brl(s.price)}`]) },
        { k: 'client_name', l: 'Nome do cliente', r: 1 }, { k: 'client_phone', l: 'Telefone', t: 'tel', r: 1 }, { k: 'date_time', l: 'Data e hora', t: 'datetime-local', r: 1 }
    ], d => api(a ? `/appointments/${id}` : '/appointments', a ? 'PUT' : 'POST', d), a ? { ...a, date_time: loc(a.date_time) } : {});
}
let SV = { q: '', cat: '', list: null };
const svList = () => SV.list || S.svcs;
function svRows() {
    return svList().filter(s => !SV.cat || s.category_id === SV.cat).map(s => `<tr><td>${esc(s.name)}<div class="mut">${esc(s.description)}</div></td><td>${esc(cat(s.category_id)?.name || '—')}</td><td>${brl(s.price)}</td><td>${s.estimated_minutes} min</td>
  <td><span class="badge ${s.is_active ? 'finalizado' : 'cancelado'}">${s.is_active ? 'ativo' : 'inativo'}</span></td>
  <td class="act"><button class="sm" onclick="formSvc('${s.id}')">Editar</button><button class="sm dng" onclick="del('/services/${s.id}','Excluir este serviço?')">Excluir</button></td></tr>`).join('') || '<tr><td colspan="6" class="mut">Nenhum serviço encontrado.</td></tr>';
}
async function svFind() { try {
    SV.list = SV.q ? list(await api('/services/search/' + enc(SV.q))) : SV.cat ? list(await api('/services/category/' + SV.cat)) : null;
    $('#tb').innerHTML = svRows();
}
catch (e) {
    toast(e.message, 1);
} }
function services() {
    return `<h2>Serviços</h2><div class="bar"><input placeholder="Buscar serviço" value="${esc(SV.q)}" oninput="SV.q=this.value;debounce(svFind)">
  <select onchange="SV.cat=this.value;svFind()"><option value="">Todas as categorias</option>${S.cats.map(c => `<option value="${c.id}" ${SV.cat === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select><span class="sp"></span><button class="pri" onclick="formSvc()">Novo serviço</button></div>
  <div class="tw"><table><thead><tr><th>Serviço</th><th>Categoria</th><th>Preço</th><th>Duração</th><th>Status</th><th></th></tr></thead><tbody id="tb">${svRows()}</tbody></table></div>`;
}
function formSvc(id) {
    const s = id ? S.svcs.find(x => x.id === id) : undefined;
    if (!S.cats.length)
        return toast('Cadastre uma categoria primeiro', 1);
    openForm(s ? 'Editar serviço' : 'Novo serviço', [
        { k: 'category_id', l: 'Categoria', t: 'select', r: 1, o: S.cats.map(c => [c.id, c.name]) }, { k: 'name', l: 'Nome', r: 1 }, { k: 'description', l: 'Descrição', t: 'area' },
        { k: 'price', l: 'Preço (R$)', t: 'number', r: 1, x: 'min="0" step="0.01"' }, { k: 'estimated_minutes', l: 'Duração (minutos)', t: 'number', r: 1, x: 'min="1" step="1"' },
        { k: 'is_active', l: 'Situação', t: 'select', o: [[true, 'Ativo'], [false, 'Inativo']] }
    ], d => api(s ? `/services/${id}` : '/services', s ? 'PUT' : 'POST', { ...d, price: +d.price, estimated_minutes: +d.estimated_minutes, is_active: d.is_active === 'true' }), s || { is_active: true });
}
let CT = { q: '', list: null };
function ctRows() {
    return (CT.list || S.cats).map(c => `<tr><td>${esc(c.name)}</td><td>${esc(c.description)}</td><td>${S.svcs.filter(s => s.category_id === c.id).length}</td>
  <td class="act"><button class="sm" onclick="formCat('${c.id}')">Editar</button><button class="sm dng" onclick="del('/categories/${c.id}','Excluir a categoria e todos os serviços dela?')">Excluir</button></td></tr>`).join('') || '<tr><td colspan="4" class="mut">Nenhuma categoria encontrada.</td></tr>';
}
async function ctFind() { try {
    CT.list = CT.q ? list(await api('/categories/search/' + enc(CT.q))) : null;
    $('#tb').innerHTML = ctRows();
}
catch (e) {
    toast(e.message, 1);
} }
function categories() {
    return `<h2>Categorias</h2><div class="bar"><input placeholder="Buscar categoria" value="${esc(CT.q)}" oninput="CT.q=this.value;debounce(ctFind)"><span class="sp"></span><button class="pri" onclick="formCat()">Nova categoria</button></div>
  <div class="tw"><table><thead><tr><th>Nome</th><th>Descrição</th><th>Serviços</th><th></th></tr></thead><tbody id="tb">${ctRows()}</tbody></table></div>`;
}
function formCat(id) {
    const c = id ? S.cats.find(x => x.id === id) : undefined;
    openForm(c ? 'Editar categoria' : 'Nova categoria', [{ k: 'name', l: 'Nome', r: 1 }, { k: 'description', l: 'Descrição', t: 'area' }], d => api(c ? `/categories/${id}` : '/categories', c ? 'PUT' : 'POST', d), c || {});
}
let C = { id: null, dt: 'pct', dv: 0, m: 'pix', rc: 0, ins: 1 };
const pick = (id) => C = { ...C, id, dv: 0, rc: 0, ins: 1 };
function calc() {
    const a = S.apps.find(x => x.id === C.id), g = Number(svc(a?.service_id)?.price || 0), v = Math.max(C.dv || 0, 0);
    const d = Math.round((C.dt === 'pct' ? g * Math.min(v, 100) / 100 : Math.min(v, g)) * 100) / 100;
    return { g, d, t: Math.round((g - d) * 100) / 100 };
}
function upd() {
    if (!C.id)
        return;
    const r = calc();
    $('#dsc').textContent = '− ' + brl(r.d);
    $('#tot').textContent = brl(r.t);
    if ($('#chg'))
        $('#chg').textContent = brl(Math.max((C.rc || 0) - r.t, 0));
    if ($('#par'))
        $('#par').textContent = `${C.ins}x de ${brl(r.t / C.ins)} sem juros`;
}
function cashier() {
    const pend = S.apps.filter(a => a.status !== 'cancelado' && !paid(a.id)), a = S.apps.find(x => x.id === C.id && pend.includes(x)), s = a && svc(a.service_id);
    const tp = P.filter(p => today(p.at));
    const right = a ? `<h3>${esc(a.client_name)}</h3><p class="mut">${esc(s?.name)} · ${dt(a.date_time)}</p>
    <div class="line"><span>Subtotal</span><b>${brl(s?.price)}</b></div>
    <div class="disc"><select aria-label="Tipo de desconto" onchange="C.dt=this.value;upd()"><option value="pct" ${C.dt === 'pct' ? 'selected' : ''}>Desconto em %</option><option value="val" ${C.dt === 'val' ? 'selected' : ''}>Desconto em R$</option></select>
    <input type="number" min="0" step="0.01" aria-label="Valor do desconto" value="${C.dv || ''}" placeholder="0" oninput="C.dv=+this.value;upd()"></div>
    <div class="line"><span>Desconto</span><b id="dsc"></b></div><div class="line tot"><span>Total</span><b id="tot"></b></div>
    <div class="pms">${Object.entries(PM).map(([k, v]) => `<button class="${C.m === k ? 'on' : ''}" onclick="C.m='${k}';render()">${v}</button>`).join('')}</div>
    ${C.m === 'dinheiro' ? `<label>Valor recebido (R$)<input type="number" min="0" step="0.01" value="${C.rc || ''}" oninput="C.rc=+this.value;upd()"></label><div class="line"><span>Troco</span><b id="chg"></b></div>` : ''}
    ${C.m === 'credito' ? `<label>Parcelas<select onchange="C.ins=+this.value;upd()">${[1, 2, 3, 4, 5, 6].map(i => `<option value="${i}" ${C.ins === i ? 'selected' : ''}>${i}x</option>`).join('')}</select></label><p class="mut" id="par"></p>` : ''}
    ${C.m === 'pix' ? '<p class="mut">Confirme o recebimento do Pix no app do banco antes de concluir.</p>' : ''}
    ${C.m === 'debito' ? '<p class="mut">Passe o cartão na maquininha e conclua após a aprovação.</p>' : ''}
    <button class="pri" style="width:100%;padding:12px" onclick="pay()">Concluir pagamento</button>` : '<p class="mut">Selecione um atendimento à esquerda para cobrar.</p>';
    return `<h2>Caixa</h2><div class="split"><div class="box"><h3 style="margin-bottom:10px">Aguardando pagamento</h3><div class="list">${pend.map(x => `<button class="item ${x.id === C.id ? 'on' : ''}" onclick="pick('${x.id}');render()"><b>${esc(x.client_name)}</b><span>${esc(svc(x.service_id)?.name || '—')} · ${brl(svc(x.service_id)?.price)} · ${dt(x.date_time)}</span></button>`).join('') || '<p class="mut">Nenhum atendimento pendente.</p>'}</div></div>
  <div class="box">${right}</div></div>
  <div class="bar" style="margin-top:22px"><span class="mut">Recebido hoje</span><b class="num" style="font-size:26px">${brl(tp.reduce((t, p) => t + p.t, 0))}</b><span class="sp"></span><a href="#revenue">Ver faturamento →</a></div>`;
}
let paying = false;
async function pay() {
    if (paying)
        return;
    const a = S.apps.find(x => x.id === C.id), r = calc();
    if (!a)
        return;
    if (C.m === 'dinheiro' && (C.rc || 0) < r.t)
        return toast('Valor recebido menor que o total', 1);
    if (C.dt === 'pct' && C.dv > 100)
        return toast('Desconto máximo é 100%', 1);
    paying = true;
    try {
        if (a.status !== 'finalizado')
            await api(`/appointments/${a.id}/status`, 'PATCH', { status: 'finalizado' });
        P.push({ id: crypto.randomUUID(), appId: a.id, svcId: a.service_id, client: a.client_name, service: svc(a.service_id)?.name || '—', g: r.g, d: r.d, t: r.t, m: C.m, ins: C.m === 'credito' ? C.ins : 1, at: new Date().toISOString() });
        savePay();
        toast(`Pagamento de ${brl(r.t)} registrado`);
        C = { id: null, dt: 'pct', dv: 0, m: 'pix', rc: 0, ins: 1 };
        load();
    }
    catch (e) {
        toast(e.message, 1);
    }
    finally {
        paying = false;
    }
}
function csv(list = P) {
    const q = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const rows = list.map(p => [dt(p.at), p.client, p.service, p.g, p.d, p.t, PM[p.m], p.ins].map(q).join(';'));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['\ufeff' + ['Data', 'Cliente', 'Serviço', 'Subtotal', 'Desconto', 'Total', 'Forma', 'Parcelas'].join(';') + '\n' + rows.join('\n')], { type: 'text/csv' }));
    a.download = 'caixa-' + ymd(new Date()) + '.csv';
    a.click();
}
/* ---------- Faturamento ---------- */
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
let R = { g: 'mes', ref: ymd(new Date()) };
const sum = (l, k = 't') => l.reduce((t, p) => t + p[k], 0);
const inRange = (p, g, ref) => {
    const d = new Date(p.at), [y, m, day] = ref.split('-').map(Number);
    return d.getFullYear() === y && (g === 'ano' || (d.getMonth() + 1 === m && (g === 'mes' || d.getDate() === day)));
};
const shift = (ref, g) => {
    const d = new Date(ref + 'T12:00');
    if (g === 'dia') d.setDate(d.getDate() - 1);
    else if (g === 'mes') { d.setDate(1); d.setMonth(d.getMonth() - 1); }
    else d.setFullYear(d.getFullYear() - 1);
    return ymd(d);
};
const revList = () => P.filter(p => inRange(p, R.g, R.ref));
function series(L) {
    const [y, m] = R.ref.split('-').map(Number);
    let n, lab, idx;
    if (R.g === 'mes') { n = new Date(y, m, 0).getDate(); lab = i => i + 1; idx = d => d.getDate() - 1; }
    else if (R.g === 'ano') { n = 12; lab = i => MESES[i]; idx = d => d.getMonth(); }
    else { n = 24; lab = i => i + 'h'; idx = d => d.getHours(); }
    const v = Array(n).fill(0);
    L.forEach(p => v[idx(new Date(p.at))] += p.t);
    let a = 0, b = n - 1;
    if (R.g === 'dia') { const f = v.findIndex(x => x > 0), l = v.map(x => x > 0).lastIndexOf(true); a = f < 0 ? 8 : Math.min(f, 8); b = l < 0 ? 18 : Math.max(l, 18); }
    return v.map((x, i) => [lab(i), x]).slice(a, b + 1);
}
const group = (L, key) => {
    const o = {};
    L.forEach(p => { const k = key(p); o[k] = o[k] || { t: 0, c: 0 }; o[k].t += p.t; o[k].c++; });
    return Object.entries(o).sort((a, b) => b[1].t - a[1].t);
};
const hbars = (rows) => { const mx = Math.max(...rows.map(r => r[1]), 0); return rows.map(([n, v, c]) => `<div class="hr"><span>${esc(n)}</span><div class="tr"><i style="width:${mx ? v / mx * 100 : 0}%"></i></div><b>${brl(v)}</b><small>${c}</small></div>`).join('') || '<p class="mut">Sem dados no período.</p>'; };
function revenue() {
    const now = ymd(new Date()), L = revList(), tot = sum(L), cnt = L.length, gross = sum(L, 'g'), disc = sum(L, 'd');
    const k = (t, g) => { const l = P.filter(p => inRange(p, g, now)); return `<div class="box stat"><div class="mut">${t}</div><div class="num">${brl(sum(l))}</div><div class="mut">${l.length} atendimento${l.length === 1 ? '' : 's'}</div></div>`; };
    const ref = new Date(R.ref + 'T12:00');
    const title = R.g === 'dia' ? ref.toLocaleDateString('pt-BR', { dateStyle: 'long' }) : R.g === 'mes' ? ref.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : String(ref.getFullYear());
    const sr = series(L), mx = Math.max(...sr.map(s => s[1]), 0);
    const prevRef = shift(R.ref, R.g), prev = sum(P.filter(p => inRange(p, R.g, prevRef)));
    const vr = prev ? (tot - prev) / prev * 100 : null;
    const sv = group(L, p => p.service), mt = group(L, p => p.m), wd = group(L, p => DIAS[new Date(p.at).getDay()]);
    const peak = R.g === 'dia' ? sr.reduce((a, b) => b[1] > a[1] ? b : a, ['—', 0]) : null;
    const share = (x) => tot ? Math.round(x / tot * 100) + '%' : '—';
    const ins = (t, v, s = '') => `<div class="box ins"><div class="mut">${t}</div><b>${v}</b><div class="mut">${s}</div></div>`;
    return `<h2>Faturamento</h2>
  <div class="stats">${k('Hoje', 'dia')}${k('Este mês', 'mes')}${k('Este ano', 'ano')}</div>
  <div class="bar"><h3 style="text-transform:capitalize">${title}</h3><span class="sp"></span>
    <div class="seg">${[['dia', 'Dia'], ['mes', 'Mês'], ['ano', 'Ano']].map(([g, l]) => `<button class="${R.g === g ? 'on' : ''}" onclick="R.g='${g}';render()">${l}</button>`).join('')}</div>
    <input type="date" aria-label="Data de referência" value="${R.ref}" onchange="if(this.value){R.ref=this.value;render()}"></div>
  <div class="stats">
    <div class="box stat" style="border-top-color:var(--acc)"><div class="mut">Faturamento líquido</div><div class="num">${brl(tot)}</div><div class="mut">${cnt} atendimento${cnt === 1 ? '' : 's'}</div></div>
    ${ins('Ticket médio', brl(cnt ? tot / cnt : 0), 'por atendimento')}
    ${ins('Descontos', brl(disc), gross ? (disc / gross * 100).toFixed(1).replace('.', ',') + '% do valor bruto' : '—')}
    ${ins('Vs. período anterior', vr === null ? '—' : `<span class="${vr >= 0 ? 'up' : 'dn'}">${vr >= 0 ? '+' : ''}${vr.toFixed(1).replace('.', ',')}%</span>`, prev ? 'anterior: ' + brl(prev) : 'sem dados anteriores')}
  </div>
  <div class="box" style="margin-bottom:14px"><h3>Evolução</h3><div class="chart">${sr.map(([l, v]) => `<div class="cb" title="${l}: ${brl(v)}"><i style="height:calc((100% - 22px) * ${mx ? v / mx : 0})"></i><span>${l}</span></div>`).join('')}</div></div>
  <div class="g2">
    <div class="box"><h3>Formas de pagamento</h3>${hbars(Object.keys(PM).map(m => [PM[m], (mt.find(x => x[0] === m) || [0, { t: 0, c: 0 }])[1].t, (mt.find(x => x[0] === m) || [0, { t: 0, c: 0 }])[1].c]))}</div>
    <div class="box"><h3>Serviços que mais faturam</h3>${hbars(sv.slice(0, 6).map(([n, o]) => [n, o.t, o.c]))}</div>
  </div>
  <div class="stats">
    ${ins('Serviço líder', sv[0] ? esc(sv[0][0]) : '—', sv[0] ? share(sv[0][1].t) + ' do faturamento' : '')}
    ${ins('Pagamento preferido', mt[0] ? PM[mt[0][0]] : '—', mt[0] ? share(mt[0][1].t) + ' do faturamento' : '')}
    ${R.g === 'dia' ? ins('Horário de pico', peak && peak[1] ? peak[0] : '—', peak && peak[1] ? brl(peak[1]) : '') : ins('Melhor dia da semana', wd[0] ? wd[0][0] : '—', wd[0] ? brl(wd[0][1].t) : '')}
  </div>
  <div class="bar"><h3>Movimentações</h3><span class="sp"></span><button onclick="csv(revList())">Exportar período (CSV)</button></div>
  <div class="tw"><table><thead><tr><th>Data</th><th>Cliente</th><th>Serviço</th><th>Subtotal</th><th>Desconto</th><th>Total</th><th>Forma</th></tr></thead><tbody>${[...L].sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 200).map(p => `<tr><td>${dt(p.at)}</td><td>${esc(p.client)}</td><td>${esc(p.service)}</td><td>${brl(p.g)}</td><td>${brl(p.d)}</td><td><b>${brl(p.t)}</b></td><td>${PM[p.m]}${p.m === 'credito' && p.ins > 1 ? ` ${p.ins}x` : ''}</td></tr>`).join('') || '<tr><td colspan="7" class="mut">Nenhum pagamento neste período.</td></tr>'}</tbody></table></div>
  <div class="box" style="margin-top:22px;display:flex;gap:12px;flex-wrap:wrap;align-items:center"><span class="mut" style="flex:1;min-width:240px">Os pagamentos ficam salvos neste navegador. Faça backup com frequência para não perder o histórico financeiro.</span>
    <button onclick="backup()">Fazer backup</button><label class="sm" style="margin:0;cursor:pointer;border:1px solid var(--ln);border-radius:var(--r);padding:5px 11px;color:var(--tx)">Restaurar backup<input type="file" accept=".json" hidden onchange="restore(this)"></label></div>`;
}
function backup() {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(P, null, 1)], { type: 'application/json' }));
    a.download = 'backup-caixa-' + ymd(new Date()) + '.json';
    a.click();
}
function restore(el) {
    const f = el.files[0];
    if (!f) return;
    f.text().then(t => {
        try {
            const l = JSON.parse(t);
            if (!Array.isArray(l)) throw 0;
            const ids = new Set(P.map(p => p.id)), add = l.filter(p => p && p.id && typeof p.t === 'number' && !ids.has(p.id));
            P = [...P, ...add]; savePay(); toast(`${add.length} pagamentos importados`); render();
        } catch { toast('Arquivo de backup inválido', 1); }
    });
}
const V = { dashboard, cashier, revenue, appointments, services, categories };
function render() {
    const v = V[location.hash.slice(1)] ? location.hash.slice(1) : 'dashboard';
    document.querySelectorAll('nav a').forEach(a => a.classList.toggle('on', a.hash === '#' + v));
    $('#view').innerHTML = V[v]();
    if (v === 'cashier')
        upd();
}
addEventListener('hashchange', render);
load();
