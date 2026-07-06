/* Modal "quick view" partilhado por todas as páginas de categoria.
   Lê os dados do catálogo partilhado (catalogo.js → LumineCatalogo).
   Cada card tem data-id; o modal mostra galeria de fotos + vídeo (se houver). */
(function(){
  const CAT = window.LumineCatalogo;
  const getPeca = id => CAT ? CAT.get(id) : (window.PECAS||{})[id];
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

  const fmtPrice = p => (typeof p.price === 'number') ? (p.price.toLocaleString('pt-PT') + ' €') : (p.price || '');

  function showImage(src){
    elMain.innerHTML = '';
    elMain.style.backgroundImage = `url('${src}')`;
  }
  function showVideo(src){
    elMain.style.backgroundImage = 'none';
    elMain.innerHTML = `<video src="${src}" controls autoplay muted playsinline
        style="width:100%;height:100%;object-fit:cover;background:#000;"></video>`;
  }

  function openModal(id){
    const p = getPeca(id); if(!p) return;
    const imgs = p.imgs || [];
    elNome.textContent = p.nome;
    elMat.textContent  = p.mat || '';
    elPrice.textContent= fmtPrice(p);
    elDesc.textContent = p.desc || '';

    // primeira média: primeira foto (ou o vídeo, se não houver fotos)
    if(imgs.length) showImage(imgs[0]);
    else if(p.video) showVideo(p.video);

    // miniaturas: fotos + (vídeo, se existir)
    const thumbs = [];
    imgs.forEach((src,i)=> thumbs.push(
      `<button data-type="img" data-src="${src}" class="${i===0?'active':''}" style="background-image:url('${src}')"></button>`
    ));
    if(p.video) thumbs.push(
      `<button data-type="video" data-src="${p.video}" class="${imgs.length?'':'active'}" style="background:#0c2a1e;display:flex;align-items:center;justify-content:center">
         <svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:#E4CE9A"><path d="M8 5v14l11-7z"/></svg>
       </button>`
    );
    if(thumbs.length > 1){
      elThumbs.style.display = 'flex';
      elThumbs.innerHTML = thumbs.join('');
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
    elMain.innerHTML = ''; // para o vídeo, se estiver a tocar
  }

  document.querySelectorAll('.card[data-id]').forEach(c=>{
    c.style.cursor = 'pointer';
    c.addEventListener('click', ()=>openModal(c.dataset.id));
  });
  elThumbs.addEventListener('click', e=>{
    const b = e.target.closest('button'); if(!b) return;
    if(b.dataset.type === 'video') showVideo(b.dataset.src);
    else showImage(b.dataset.src);
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
