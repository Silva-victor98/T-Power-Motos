/* =========================
   supabaseAdmin.js
   Funções do Supabase para o painel administrativo
   Não altera o layout
========================= */

// 1️⃣ Conexão com o Supabase
const supabase = createClient('SUA_URL_DO_SUPABASE', 'SUA_KEY_DO_SUPABASE');

/* =========================
   2️⃣ Função para carregar motos (Read)
========================= */
async function carregarMotos() {
  const { data, error } = await supabase.from('motos').select('*');
  if (error) {
    console.error('Erro ao carregar motos:', error);
    return [];
  }
  return data;
}

/* =========================
   3️⃣ Funções CRUD
========================= */

// Atualizar moto
async function atualizarMoto(id, dadosAtualizados) {
  const { error } = await supabase
    .from('motos')
    .update(dadosAtualizados)
    .eq('id', id);

  if (error) console.error('Erro ao atualizar moto:', error);
}

// Adicionar nova moto
async function adicionarMoto(novaMoto) {
  const { error } = await supabase
    .from('motos')
    .insert([novaMoto]);

  if (error) console.error('Erro ao adicionar moto:', error);
}

// Deletar moto
async function excluirMoto(id) {
  const { error } = await supabase
    .from('motos')
    .delete()
    .eq('id', id);

  if (error) console.error('Erro ao excluir moto:', error);
}

/* =========================
   4️⃣ Exportar funções globalmente
   (opcional, caso use módulos)
========================= */
window.carregarMotos = carregarMotos;
window.atualizarMoto = atualizarMoto;
window.adicionarMoto = adicionarMoto;
window.excluirMoto = excluirMoto;
