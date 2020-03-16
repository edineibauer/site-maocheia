<section id="topo">
    <div class="container">
        <div class="row">
            <div class="float-left mr-3 ml-3">

                <figure class="mt-2"><img src="<?=(!empty($_SESSION['userlogin']['imagem']) ? $_SESSION['userlogin']['imagem']['urls']['100'] : HOME . VENDOR . "site-maocheia/public/assets/svg/account.svg")?>" alt="<?=$_SESSION['userlogin']['nome']?>" title="<?=$_SESSION['userlogin']['nome']?>"></figure>
            </div>
            <div class="float-left">
                <div>
                    <h4 class="mt-2"><?=$_SESSION['userlogin']['nome']?></h4>
                </div>
                <div>
                    <div class="avaliacao-perfil">
                        <ul class="horizontal-list">
                            <li><i class="material-icons">star</i></li>
                            <li><i class="material-icons">star</i></li>
                            <li><i class="material-icons">star</i></li>
                            <li><i class="material-icons">star</i></li>
                            <li><i class="material-icons">star</i></li>
                            <li> 5</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section id="perfil">
    <div class="container">
        <a href="conta" data-animation="forward" class="row borda-row">
            <div class="col-8 col-lg-8">
                <div class="titulo-h6">Configurações da conta</div>
                <div class="informacao-div">Informações pessoais</div>
            </div>
            <div class="col-4 col-lg-4 mt-3 text-right">
                <i class="material-icons">person</i>
            </div>
        </a>
        <a href="perfil_profissional" data-animation="forward" class="row borda-row">
            <div class="col-8 col-lg-8">
                <div class="titulo-h6">Configurações da conta Profissional</div>
                <div class="informacao-div">Abrir perfil profissional</div>
            </div>
            <div class="col-4 col-lg-4 mt-3 text-right">
                <i class="material-icons">business</i>
            </div>
        </a>
        <a href="configuracoes" data-animation="forward" class="row borda-row">
            <div class="col-8 col-lg-8">
                <div class="titulo-h6">Configurações Gerais</div>
                <div class="informacao-div">Configurações do aplicativo</div>
            </div>
            <div class="col-4 col-lg-4 mt-3 text-right">
                <i class="material-icons">more_horiz</i>
            </div>
        </a>
        <a href="termo" data-animation="forward" class="row borda-row">
            <div class="col-8 col-lg-8">
                <div class="informacao-div">Termo de uso</div>
            </div>
            <div class="col-4 col-lg-4 mt-2 text-right">
                <i class="material-icons">insert_drive_file</i>
            </div>
        </a>
    </div>
</section>
<section id="sair-aplicativo">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-6 col-lg-5">
                <div class="sair-app"><i class="material-icons">exit_to_app</i> Sair do aplicativo</div>
            </div>
        </div>
    </div>
</section>