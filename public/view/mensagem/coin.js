(async () => {
    let busca = new Read;
    let minhaMensagem = await busca.exeRead("messages_user", {"usuario": history.state.param.url[0]});
    if(isEmpty(minhaMensagem.mensagem)) {
        console.log('ok');
    }
})();
