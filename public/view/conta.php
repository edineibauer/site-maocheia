<section id="perfil">

    <div class="container">
        <div class="row">
            <a href="perfil" data-animation="back" class="col-3 volta">
                <i class="material-icons">arrow_back</i>
            </a>
        </div>
        <div class="row  mt-2 no-gutters">
            <div class="col-3">
                <figure class="text-center">
                    <img src="<?=(!empty($_SESSION['userlogin']['imagem']) ? $_SESSION['userlogin']['imagem']['urls']['100'] : HOME . VENDOR . "site-maocheia/public/assets/svg/account.svg")?>" alt="<?=$_SESSION['userlogin']['nome']?>" title="<?=$_SESSION['userlogin']['nome']?>">
                </figure>
            </div>
            <div class="col-8 col-perfil">
                <h2 id="titulo" class="titulo"></h2>
                <button id="change-image">alterar imagem</button>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <h6 style="font-weight: 600">Informações pessoais</h6>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div id="formProfissional">

                    <div class="row">
                        <div class="form-group col-12 col-lg-6">
                            <label for="nome">Nome</label>
                            <input type="text" class="form-control" id="nome">
                        </div>
                        <div class="form-group col-12 col-lg-6 pt-2">
                            <label for="cpf">CPF</label>
                            <input type="text" class="form-control cpf" id="cpf" readonly="readonly" disabled="disabled">
                        </div>
                    </div>

                    <div class="row">
                        <div class="form-group col-12 col-lg-6 pt-2">
                            <label for="email">Email</label>
                            <input type="email" class="form-control email" id="email" readonly="readonly" disabled="disabled">
                        </div>
                        <div class="form-group col-12 col-lg-6 pt-2">
                            <label for="sexo">Sexo</label>
                            <select class="form-control" id="sexo">
                                <option>Masculino</option>
                                <option>Feminino</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-12 col-lg-6 pt-2">
                            <label for="telefone">Telefone</label>
                            <input type="text" class="form-control tel" id="telefone" readonly="readonly" disabled="disabled">
                        </div>
                        <div class="form-group col-12 col-lg-6 pt-2">
                            <label for="aniversario">Aniversário</label>
                            <input type="date" class="form-control" id="aniversario" readonly="readonly" disabled="disabled">
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-12 col-lg-6 pt-2">
                            <label for="senha">Nova senha</label>
                            <input type="password" class="form-control" id="senha" readonly="readonly" disabled="disabled">
                        </div>
                        <div class="form-group col-12 col-lg-6 pt-2 hide" id="setor-endereco">
                            <label for="endereco">Endereço</label>
                            <input type="text" class="form-control" id="endereco" readonly="readonly" disabled="disabled">
                        </div>
                    </div>
                    <div class="col mt-4">
                        <div class="text-center">
                            <button id="salvar" class="btn theme">salvar Perfil</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>