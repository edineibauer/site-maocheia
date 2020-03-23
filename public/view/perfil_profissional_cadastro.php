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
                <div class="subtitulo">
                    Informações profissionais
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <form action="" method="POST">
                    <div class="form-group">
                        <label for="nome">Nome</label>
                        <input type="text" class="form-control" id="nome" aria-describedby="nomeHelp">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Email</label>
                        <input type="email" class="form-control" id="InputEmail1" aria-describedby="emailHelp">
                    </div>
                    <div class="form-group ">
                        <label for="telefone">Telefone</label>
                        <input type="text" class="form-control" id="telefone" aria-describedby="telefoneHelp">
                    </div>
                    <div class="form-group">
                        <label for="endereco-profissional">Endereço profissional</label>
                        <input type="text" class="form-control" id="endereco-profissional"
                               aria-describedby="endereco-profissionalHelp">
                    </div>
                    <div class="row">
                        <div class="form-group col-12 col-lg-6">
                            <label for="categoria">Categoria</label>
                            <input type="text" class="form-control" id="categoria" aria-describedby="categoriaHelp">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="sobre">Sobre</label>
                        <textarea class="form-control" id="sobre" rows="3"></textarea>
                    </div>

                    <div class="form-group">
                        <div class="input-group-prepend">
                            <span>Imagem de perfil</span>
                        </div>
                        <div>
                            <div class="Neon Neon-theme-dragdropbox">
                                <input class="carregar-foto" name="files[]" id="filer_input2" multiple="multiple"
                                       type="file">
                                <div class="bordas">
                                    <div class="Neon-input-inner">
                                        <div class="Neon-input-icon"><i class="fa fa-file-image-o"></i></div>
                                        <div class="Neon-input-text">
                                            <h3><span class="mdi mdi-plus"></span></h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group ">
                        <div class="input-group-prepend">
                            <span>Imagem de fundo</span>
                        </div>
                        <div>
                            <div class="Neon Neon-theme-dragdropbox">
                                <input class="carregar-foto" name="files[]" id="filer_input2" multiple="multiple"
                                       type="file">
                                <div class="bordas-fundos">
                                    <div class="Neon-input-inner">
                                        <div class="Neon-input-icon"><i class="fa fa-file-image-o"></i></div>
                                        <div class="Neon-input-text">
                                            <h3><span class="mdi mdi-plus"></span></h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row justify-content-center">
                        <div class="form-group col-12 col-lg-6">
                            <button type="submit" class="btn btn-primary">CRIAR CONTA PROFISSIONAL</button>
                        </div>
                    </div>

                </form>
            </div>
        </div>

    </div>
</section>