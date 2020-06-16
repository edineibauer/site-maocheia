<section id="topo">
    <div class="container">
        <div class="row">
            <div class="col-3 col-lg-2">
                <div id="perfil-image" style="background-image: url('<?=HOME . VENDOR?>site-maocheia/public/assets/svg/account.svg')"></div>
            </div>
            <div class="col-8 col-lg-8" style="padding: 0;">
                <div class="row">
                    <div class="col-7">
                        <h5 class="mt-2" style="max-height: 43px;line-height: 21px;overflow: hidden;" id="nome-user"><?=$_SESSION['userlogin']['nome']?></h5>
                        <div id="avaliacao-perfil-profissional"></div>
                        <div id="preco-perfil-profissional"></div>
                    </div>
                    <div class="col-5 col-md-4 col-lg-2 hide" id="saldoProfissional">
                        <div class="saldo">
                            <div class="row no-gutters">
                                <div class="moeda">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21"><g transform="translate(0 0.373)"><g transform="translate(0 -0.373)"><path d="M21,10.5a10.519,10.519,0,1,1-3.392-7.727A10.5,10.5,0,0,1,21,10.5Z" transform="translate(0)" fill="#f0cd00"/><path d="M36.485,10.644A10.5,10.5,0,0,1,26.376,21.137a10.5,10.5,0,0,1,0-20.985A10.5,10.5,0,0,1,36.485,10.644Z" transform="translate(-15.485 -0.144)" fill="#ffde50"/><path d="M46.185,31.358,31.349,46.194a10.545,10.545,0,0,1-1.33-1.794L44.392,30.028A10.5,10.5,0,0,1,46.185,31.358Z" transform="translate(-28.577 -28.585)" fill="#ffea94"/><path d="M99.562,85.947,85.947,99.562a10.486,10.486,0,0,1-2.658-1.527L98.035,83.289A10.467,10.467,0,0,1,99.562,85.947Z" transform="translate(-79.286 -79.286)" fill="#ffea94"/><path d="M65.03,56.871a8.159,8.159,0,0,1-16.317.1c0-.033,0-.067,0-.1a8.159,8.159,0,0,1,8.159-8.159h.1a8.121,8.121,0,0,1,4.6,1.488,8.213,8.213,0,0,1,2.248,2.391A8.12,8.12,0,0,1,65.03,56.871Z" transform="translate(-46.371 -46.371)" fill="#faa300"/><path d="M62.64,51.1,51.1,62.64a8.13,8.13,0,0,1-2.389-5.669c0-.033,0-.067,0-.1a8.159,8.159,0,0,1,8.159-8.159h.1a8.121,8.121,0,0,1,4.6,1.488A8.234,8.234,0,0,1,62.64,51.1Z" transform="translate(-46.371 -46.371)" fill="#ffbd00"/><path d="M217.528,56.871a8.159,8.159,0,0,1-8.159,8.159q-.232,0-.461-.013a8.159,8.159,0,0,0,0-16.293q.229-.013.461-.013A8.159,8.159,0,0,1,217.528,56.871Z" transform="translate(-198.869 -46.371)" fill="#f68e00"/></g><g transform="translate(3.973 3.6)"><path d="M7.189,1,5.5,5.5,1,7.189,5.5,8.876l1.688,4.5,1.688-4.5,4.5-1.688L8.876,5.5Z" transform="translate(-1 -0.603)" fill="#f68e00"/><path d="M7.189,1,5.5,5.5,1,7.189,5.5,8.876l1.688,4.5,1.688-4.5,4.5-1.688L8.876,5.5Z" transform="translate(-0.603 -1)" fill="#fff3c2"/></g></g></svg>
                                </div>
                                <div class="valor" id="moedas"></div>
                                <div class="mais">+</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section id="perfil">
    <div class="container">
        <a href="conta" class="row borda-row">
            <div class="col-8 col-lg-8">
                <div class="titulo-h6">Configurações da conta</div>
                <div class="informacao-div">Perfil pessoal</div>
            </div>
            <div class="col-4 col-lg-4 mt-3 text-right">
                <i class="material-icons">person</i>
            </div>
        </a>

        <div id="setor-profissional"></div>

        <a href="configuracoes" class="row borda-row">
            <div class="col-8 col-lg-8">
                <div class="titulo-h6">Configurações Gerais</div>
                <div class="informacao-div">Configurações do aplicativo</div>
            </div>
            <div class="col-4 col-lg-4 mt-3 text-right">
                <i class="material-icons">more_horiz</i>
            </div>
        </a>
        <div class="row borda-row update-btn">
            <div class="col-8 col-lg-8">
                <div class="informacao-div">Atualizar</div>
            </div>
            <div class="col-4 col-lg-4 mt-2 text-right">
                <i class="material-icons">refresh</i>
            </div>
        </div>
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