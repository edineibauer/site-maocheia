<section id="login">
    <div class="container">
        <div class="row">
            <div class="col-12">
                <a class="figure" href="home" data-animation="forward">
                    <img src="<?= HOME . VENDOR ?>site-maocheia/public/assets/img/logo.png" alt="<?= SITENAME ?>"
                         title="<?= SITENAME ?>"/>
                </a>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <h3 class="titulo">Entrar</h3>
            </div>
        </div>
        <div class="row">
            <div class="col-12">

                <div id="fazer-login">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" class="form-control" id="email">
                    </div>
                    <div class="form-group mt-2">
                        <label for="senha">Senha</label>
                        <input type="password" class="form-control" id="senha">
                        <div class="text-end">
                            <a href="esqueci-a-senha" data-animation="forward">Esqueceu a senha?</a>
                        </div>
                    </div>

                    <div class="row justify-content-center mt-4">
                        <div class="form-group col-12 col-lg-6">
                            <button id="btn-tela-cadastro" class="btn btn-primary">Acessar</button>
                        </div>
                        <div class="col-12 mt-2">
                            <div class="conta text-center">Não possui uma conta? <a class="jaTemConta" href="cadastro"
                                                                                    data-animation="forward">Cadastre-se</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</section>
<!--

<div class="modal fade" id="esqueceuModal" tabindex="-1" role="dialog" aria-labelledby="esqueceuModalLabel"
     aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="esqueceuModalLabel">Recuperar Senha</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="recuperar-senha" method="POST" action="">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" class="form-control" id="email" aria-describedby="emailHelp" required>
                    </div>
                    <div class="form-group col-12 col-lg-6">
                        <button id="btn-tela-cadastro" type="submit" class="btn btn-primary">Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>-->