/* ============================================================
   CARRINHO DA LUMINE
   Guarda os itens em localStorage (lumine_cart) e mantém o
   contador do ícone da sacola em todas as páginas.
   Também liga o menu mobile (hambúrguer), pois este ficheiro
   é carregado em todas as páginas do site.
   ============================================================ */
window.LumineCart = (function () {
  const KEY = 'lumine_cart';

  function read(){ try{ const d=JSON.parse(localStorage.getItem(KEY)); return Array.isArray(d)?d:[]; }catch(e){ return []; } }
  function write(list){ try{ localStorage.setItem(KEY, JSON.stringify(list)); }catch(e){} updateBadge(); }

  function items(){ return read(); }
  function count(){ return read().reduce((s,i)=>s + (i.qty||0), 0); }
  function add(id, qty){ qty = qty||1; const l=read(); const it=l.find(x=>x.id===id);
    if(it) it.qty += qty; else l.push({id:id, qty:qty}); write(l); }
  function setQty(id, qty){ const l=read(); const it=l.find(x=>x.id===id);
    if(it){ it.qty = Math.max(1, qty); write(l); } }
  function remove(id){ write(read().filter(x=>x.id!==id)); }
  function clear(){ write([]); }

  // junta os itens do carrinho com os dados do catálogo (nome, preço, foto)
  function detailed(){
    const cat = window.LumineCatalogo;
    return read().map(function(ci){
      const p = cat ? cat.get(ci.id) : null;
      if(!p) return null;
      return { id:ci.id, qty:ci.qty, nome:p.nome, price:p.price, mat:p.mat,
               img:(p.imgs && p.imgs[0]) || 'img/logo-lumine.png' };
    }).filter(Boolean);
  }

  function updateBadge(){
    const c = count();
    document.querySelectorAll('.cart-count').forEach(function(b){
      b.textContent = c; b.style.display = c ? 'flex' : 'none';
    });
  }

  function initMenu(){
    const mt = document.querySelector('.menu-toggle');
    const nl = document.querySelector('.nav-links');
    if(mt && nl){
      mt.addEventListener('click', function(){
        const open = nl.classList.toggle('open');
        mt.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      nl.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>nl.classList.remove('open')));
    }
  }

  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }
  ready(function(){ updateBadge(); initMenu(); });

  return { KEY, items, count, add, setQty, remove, clear, detailed, updateBadge };
})();
