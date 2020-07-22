(async () => {
    let cliente = await AJAX.getUrl(SERVER + "app/find/clientes/usuarios_id/" + history.state.param.url[0]);
    if(cliente.response === 1 && !isEmpty(cliente.data) && !isEmpty(cliente.data.clientes)) {
        cliente = cliente.data.clientes[0];
        $("#menu-chat").htmlTemplate("mensagemMenu", cliente);
    }
})();
