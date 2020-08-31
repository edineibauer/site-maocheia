$(function () {
    if(!isEmpty(USER.setorData.perfil_profissional)) {
        $("#avaliacao-perfil-profissional").profissionalStar(USER.setorData.avaliacao/10000000);
        $("#preco-perfil-profissional").profissionalPreco(USER.setorData.perfil_profissional[0].preco_justo || 0);
    }
});