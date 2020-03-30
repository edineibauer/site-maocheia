<section id="cadastro-profissional">
    <div class="container">
        <div class="row">
            <div class="col-12">
                <a href="#back" class="volta">
                    <i class="material-icons">arrow_back</i>
                </a>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <h2 class="titulo">Criar conta profissional</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="form-group">
                    <label for="categoria">Categoria</label>
                    <select class="form-control" id="categoria">
                        <option>Selecione...</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="sobre">Sobre</label>
                    <textarea class="form-control" id="sobre" rows="3"></textarea>
                </div>

                <div class="form-group mb-5">
                    <div class="input-group-prepend">
                        <span>Imagem de perfil</span>
                    </div>
                    <div>
                        <input class="carregar-foto" id="imagem_de_perfil" type="file">
                        <input class="carregar-foto" id="imagem_de_fundo" type="file">

                        <div class="Neon Neon-theme-dragdropbox">
                            <label for="imagem_de_perfil" class="bordas" id="imagem_de_perfil_preview">
                                <i class="material-icons">image</i>
                            </label>

                            <label for="imagem_de_fundo" class="bordas-fundos" id="imagem_de_fundo_preview">
                                <i class="material-icons">image</i>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="col">
                    <i class="material-icons" id="scrollDown" style="font-size: 45px;text-align: center;width: 100%;margin-top: -7px;">keyboard_arrow_down</i>
                </div>

                <div class="row justify-content-center">
                    <div class="form-group col-12 col-lg-6">
                        <button class="btn btn-primary" id="update-profissional">ATUALIZAR</button>
                    </div>
                </div>

            </div>
        </div>

    </div>
</section>