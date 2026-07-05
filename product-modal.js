/* Modal "quick view" partilhado por todas as páginas de categoria.
   Cada página define window.PECAS = { id: {nome, mat, price, desc, imgs:[...]} }
   e adiciona data-id nos cards. */
(function(){
  const PECAS = window.PECAS || {};
  const star = '<svg class="st" viewBox="0 0 100 100"><path d="M50 0 C54 34 66 46 100 50 C66 54 54 66 50 100 C46 66 34 54 0 50 C34 46 46 34 50 0 Z"/></svg>';

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div class="modal-overlay" id="modal" aria-hidden="true">
      <div class="modal" role="dialog" aria-modal="true">
        <button class="modal-close" id="modal-close" aria-label="Fechar">&times;</button>
        <div class="modal-gallery">
          <div class="modal-main" id="modal-main"></div>
          <div class="modal-thumbs" id="modal-thumbs"></div>
        </div>
        <div class="modal-info">
          <span class="eyebrow">Lumine</span>
          <h3 id="modal-nome"></h3>
          <div class="mat" id="modal-mat"></div>
          <div class="price" id="modal-price"></div>
          <p class="desc" id="modal-desc"></p>
          <div class="modal-meta">
            <span>${star} Envio em 48h para todo o Portugal</span>
            <span>${star} Garantia real · Semijoia que dura</span>
          </div>
          <div class="actions">
            <button class="btn btn-solid" id="buy-now">Comprar agora</button>
            <button class="btn" id="add-cart">Adicionar ao carrinho</button>
          </div>
        </div>
      </div>
    </div>
    <div class="toast" id="toast"></div>`;
  document.body.appendChild(wrap);

  const modal   = document.getElementById('modal');
  const elMain  = document.getElementById('modal-main');
  const elThumbs= document.getElementById('modal-thumbs');
  const elNome  = document.getElementById('modal-nome');
  const elMat   = document.getElementById('modal-mat');
  const elPrice = document.getElementById('modal-price');
  const elDesc  = document.getElementById('modal-desc');

  const setMain = src => { elMain.style.backgroundImage = `url('${src}')`; };

  function openModal(id){
    const p = PECAS[id]; if(!p) return;
    elNome.textContent = p.nome;
    elMat.textContent  = p.mat;
    elPrice.textContent= p.price;
    elDesc.textContent = p.desc;
    setMain(p.imgs[0]);
    // miniaturas só quando há mais de uma foto
    if(p.imgs.length > 1){
      elThumbs.style.display = 'flex';
      elThumbs.innerHTML = p.imgs.map((src,i)=>
        `<button data-src="${src}" class="${i===0?'active':''}" style="background-image:url('${src}')"></button>`
      ).join('');
    } else {
      elThumbs.style.display = 'none';
      elThumbs.innerHTML = '';
    }
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.card[data-id]').forEach(c=>{
    c.style.cursor = 'pointer';
    c.addEventListener('click', ()=>openModal(c.dataset.id));
  });
  elThumbs.addEventListener('click', e=>{
    const b = e.target.closest('button'); if(!b) return;
    setMain(b.dataset.src);
    elThumbs.querySelectorAll('button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
  });
  document.getElementById('modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', e=>{ if(e.target===modal) closeModal(); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });

  let toastTimer;
  function toast(msg){
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>t.classList.remove('show'), 2600);
  }
  document.getElementById('add-cart').addEventListener('click', ()=>toast('Adicionado ao cesto ✦'));
  document.getElementById('buy-now').addEventListener('click', ()=>toast('A ir para o checkout…'));
})();
