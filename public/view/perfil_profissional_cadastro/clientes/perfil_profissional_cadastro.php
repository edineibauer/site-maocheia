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

                <div class="form-group">
                    <label for="categoria" class="pb-1">Profissão *</label>
                    <select class="form-control" id="categoria">
                        <option>Selecione...</option>
                    </select>
                </div>
                <div class="form-group hide" id="areasatuacao">
                    <label for="categoria">Áreas de atuação</label>
                    <div class="pt-1 row pl-3 pr-3 pb-3" id="subcategorias"></div>
                </div>

                <div class="row mt-2">
                    <div class="col s6">
                        <label for="inicio" class="pb-1">Hora de início *</label>
                        <input type="time" class="form-control" id="inicio"/>
                    </div>
                    <div class="col s6">
                        <label for="termino" class="pb-1">Hora de término *</label>
                        <input type="time" class="form-control" id="termino"/>
                    </div>
                </div>

                <span class="row pb-1 mt-3 pl-3" style="font-size: 13px; color:#999999">Dias de Trabalho</span>
                <div class="col container mt-1 mb-2">
                    <div class="row">
                        <div class="custom-control custom-checkbox col col-4">
                            <input type="checkbox" class="dias custom-control-input" id="segunda">
                            <label class="custom-control-label pt-1" for="segunda">Segunda</label>
                        </div>
                        <div class="custom-control custom-checkbox col col-4">
                            <input type="checkbox" class="dias custom-control-input" id="terca">
                            <label class="custom-control-label pt-1" for="terca">Terça</label>
                        </div>
                        <div class="custom-control custom-checkbox col col-4">
                            <input type="checkbox" class="dias custom-control-input" id="quarta">
                            <label class="custom-control-label pt-1" for="quarta">Quarta</label>
                        </div>
                        <div class="custom-control custom-checkbox col col-4">
                            <input type="checkbox" class="dias custom-control-input" id="quinta">
                            <label class="custom-control-label pt-1" for="quinta">Quinta</label>
                        </div>
                        <div class="custom-control custom-checkbox col col-4">
                            <input type="checkbox" class="dias custom-control-input" id="sexta">
                            <label class="custom-control-label pt-1" for="sexta">Sexta</label>
                        </div>
                        <div class="custom-control custom-checkbox col col-4">
                            <input type="checkbox" class="dias custom-control-input" id="sabado">
                            <label class="custom-control-label pt-1" for="sabado">Sábado</label>
                        </div>
                        <div class="custom-control custom-checkbox col col-4">
                            <input type="checkbox" class="dias custom-control-input" id="domingo">
                            <label class="custom-control-label pt-1" for="domingo">Domingo</label>
                        </div>
                    </div>
                </div>

                <div class="form-group pt-3">
                    <label for="sobre" class="pb-1">Distância de atendimento em KM</label>
                    <input type="number" min="0" max="10000000000" class="form-control" id="distancia" />
                </div>

                <div class="form-group pt-3">
                    <label for="sobre">Sobre *</label>
                    <textarea class="form-control" id="sobre" rows="3"></textarea>
                </div>

                <div class="form-group mb-3">
                    <div class="input-group-prepend">
                        <label class="pt-2">Galeria de imagens</label>
                    </div>
                    <div>
                        <input class="carregar-foto" id="galeria" type="file" multiple>
                        <div class="Neon Neon-theme-dragdropbox">
                            <div class="bordas-galeria">
                                <div id="galeria_preview_parent">
                                    <div id="galeria_preview">
                                        <label for="galeria" class="material-icons">image</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group pt-3">
                    <label for="whatsapp" class="pb-1">Whatsapp * (com DDD)</label>
                    <input type="number" class="form-control telefone tel" id="whatsapp" minlength="10" min="10" maxlength="15" max="14" required="required" />
                </div>

                <div class="form-group pt-1">
                    <label for="telefone" class="pb-1">Telefone (com DDD)</label>
                    <input type="number" class="form-control telefone tel" id="telefone" minlength="10" min="10" maxlength="15" max="14" />
                </div>

                <div class="form-group pt-1">
                    <label for="email" class="pb-1">Email</label>
                    <input type="email" class="form-control email" id="email" maxlength="127" max="127">
                </div>

                <div class="form-group pt-1">
                    <label for="site" class="pb-1">Site</label>
                    <input type="url" class="form-control" id="site" pattern="^https?:\/\/\w+.\.+" maxlength="254" max="254">
                </div>

                <div class="row justify-content-center">
                    <div class="form-group col-12 col-lg-6 mb-4">
                        <button class="btn btn-primary" id="create-profissional">CRIAR CONTA PROFISSIONAL</button>
                    </div>
                </div>

            </div>
        </div>

    </div>
</section>