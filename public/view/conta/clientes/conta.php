<section id="perfil">

    <div class="container">
        <div class="row">
            <a href="perfil" data-animation="back" class="col-3 volta">
                <i class="material-icons">arrow_back</i>
            </a>
        </div>

        <div class="row mt-3 mb-3">
            <div class="col-12">
                <h6 style="font-weight: 600">Informações pessoais</h6>
            </div>
        </div>

        <div class="row mb-3">
            <div class="col-12">
                <input class="carregar-foto" id="imagem_de_perfil" type="file">
                <div class="Neon Neon-theme-dragdropbox">
                    <label for="imagem_de_perfil" class="bordas" id="imagem_de_perfil_preview">
                        <i class="material-icons">image</i>
                    </label>
                    <label for="imagem_de_perfil" id="change-image">alterar imagem</label>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div id="formProfissional">

                    <div class="row">
                        <div class="form-group col-6">
                            <label for="nome">Nome</label>
                            <input type="text" class="form-control" id="nome">
                        </div>
                        <div class="form-group col-6">
                            <label for="cpf">CPF</label>
                            <input type="text" class="form-control cpf" id="cpf" readonly="readonly" disabled="disabled">
                        </div>
                    </div>
                    <div class="row pt-2">
                        <div class="form-group col-6">
                            <label for="email">Email</label>
                            <input type="email" class="form-control email" id="email" readonly="readonly" disabled="disabled">
                        </div>
                        <div class="form-group col-6">
                            <label for="telefone">Telefone</label>
                            <input type="text" class="form-control tel" id="telefone" readonly="readonly" disabled="disabled">
                        </div>
                    </div>
                    <div class="row pt-2">
                        <div class="form-group col-12 col-lg-6">
                            <label for="senha">Nova senha</label>
                            <input type="password" class="form-control" id="senha" readonly="readonly" disabled="disabled">
                        </div>
                    </div>
                    <div class="mt-4">
                        <div class="text-center">
                            <button id="salvar" class="btn col theme py-2">salvar Perfil</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>