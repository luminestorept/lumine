/* ============================================================
   CATÁLOGO PARTILHADO DA LUMINE
   Fonte única de produtos, usada pelo site E pelo painel (admin.html).
   Guarda em localStorage — o que o painel altera aparece no site
   automaticamente (no mesmo navegador/dispositivo).
   Na versão de produção isto passa a ler de uma base de dados na
   nuvem (Supabase), e a sincronização deixa de depender do dispositivo.
   ============================================================ */
window.LumineCatalogo = (function () {
  const KEY = 'lumine_produtos';

  // Catálogo inicial (peças reais da Lumine). Preços/stock provisórios.
  const SEED = [
    { id:'colar-coracao', nome:'Colar Coração', cat:'Colares', mat:'Banho a ouro · zircónias', price:34, stock:9, pos:'center 18%',
      desc:'Colar gravata em banho a ouro, com argola cravejada de zircónias e pendentes em coração. Ajustável, para um caimento em "Y" que valoriza o colo.',
      imgs:['img/p-colar-coracao.png','img/p-colar-coracao-2.png'], video:'' },
    { id:'colar-argola', nome:'Colar com Argola', cat:'Colares', mat:'Prata', price:29, stock:3, pos:'center',
      desc:'Colar em prata com fecho de argola e barra em T. Um clássico com toque contemporâneo, para usar sozinho ou em camadas.',
      imgs:['img/p-colar-argola.png','img/banner-colares.png'], video:'' },
    { id:'colar-esfera', nome:'Colar Esfera', cat:'Colares', mat:'Banho a ouro', price:27, stock:14, pos:'center 22%',
      desc:'Corrente fina em banho a ouro com pendente esfera polida. Minimalismo puro — o detalhe que completa qualquer look.',
      imgs:['img/p-colar-esfera-ouro.jpg','img/p-colar-esfera.jpg'], video:'' },
    { id:'conjunto', nome:'Conjunto Colar + Anel', cat:'Colares', mat:'Banho a ouro', price:42, stock:6, pos:'center',
      desc:'Conjunto em banho a ouro: colar de pendente esfera e anel ajustável a condizer. Presença coordenada, do pescoço à mão.',
      imgs:['img/p-conjunto-colar-anel.jpg','img/p-anel-barra.png'], video:'' },
    { id:'anel-perola', nome:'Anel de Pérola', cat:'Anéis', mat:'Banho a ouro · pérola', price:24, stock:11, pos:'center',
      desc:'Anel aberto e ajustável em banho a ouro, com pérola de água doce numa ponta e terminação polida na outra. Discreto e atemporal.',
      imgs:['img/p-anel-perola.png','img/p-anel-perola-2.jpg'], video:'' },
    { id:'anel-barra', nome:'Anel Barra', cat:'Anéis', mat:'Banho a ouro', price:22, stock:2, pos:'center',
      desc:'Anel ajustável em banho a ouro com barra e esfera. Linhas geométricas, presença contemporânea.',
      imgs:['img/p-anel-barra.png'], video:'' },
    { id:'anel-mop', nome:'Anel Madrepérola', cat:'Anéis', mat:'Banho a ouro · madrepérola', price:26, stock:8, pos:'center',
      desc:'Anel em banho a ouro com placa de madrepérola de reflexos rosados. Um clássico com brilho natural.',
      imgs:['img/p-anel-mop.jpg'], video:'' },
    { id:'brincos-perola', nome:'Brincos de Pérola', cat:'Brincos', mat:'Banho a ouro · pérola', price:19, stock:16, pos:'center',
      desc:'Brincos de pérola de água doce com pino em banho a ouro. O clássico que combina com tudo, do dia ao jantar.',
      imgs:['img/p-brincos-perola.png','img/p-brincos-perola-2.png','img/p-brincos-perola-3.png'], video:'' },
    { id:'brincos-gota', nome:'Brincos Gota', cat:'Brincos', mat:'Cristais', price:23, stock:5, pos:'center',
      desc:'Brincos pendentes com cristais em gota e tom lilás. Um toque de cor para os dias que pedem brilho.',
      imgs:['img/p-brincos-gota.jpg'], video:'' },
    { id:'pulseira-snake', nome:'Pulseira Snake', cat:'Pulseiras', mat:'Banho a ouro', price:29, stock:1, pos:'center',
      desc:'Pulseira de malha snake cilíndrica em banho a ouro. Caimento fluido e brilho contínuo — o essencial que nunca sai de moda.',
      imgs:['img/p-pulseira-snake.png','img/p-pulseira-snake-2.png'], video:'' },
    { id:'pulseira-multifios', nome:'Pulseira Multi-fios', cat:'Pulseiras', mat:'Banho a ouro', price:32, stock:7, pos:'center',
      desc:'Pulseira de vários fios finos em banho a ouro, com fecho e extensão ajustável. Delicada, com movimento e luz.',
      imgs:['img/p-pulseira-multifios.jpg'], video:'' }
  ];

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; }
  }
  function all() {
    let d = read();
    if (!Array.isArray(d)) { d = JSON.parse(JSON.stringify(SEED)); write(d); }
    return d;
  }
  function write(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); return true; }
    catch (e) { return false; } // ex.: quota cheia (muitas fotos/vídeo grande)
  }
  function byCat(cat) { return all().filter(p => p.cat === cat); }
  function get(id) { return all().find(p => p.id === id); }
  function reset() { localStorage.removeItem(KEY); return all(); }

  return { KEY, SEED, all, save: write, byCat, get, reset };
})();
