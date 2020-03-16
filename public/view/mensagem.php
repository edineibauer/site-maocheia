<div id="frame">
    <div class="content">
        <section class="message">
            <div class="contact-profile">
                <a href="#back" data-animation="back">
                    <i class="material-icons" id="arrowback">arrow_back</i>
                </a>
                <div id="perfil-info"></div>
                <div class="social-media">
                    <i class="material-icons">more_vert</i>
                </div>
            </div>
            <div class="messages">
                <ul class="mb-0"></ul>
            </div>
        </section>

        <section class="nomessage">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div>
                            <h3 class="titulo" style="font-weight: 700">Mensagem</h3>
                        </div>
                        <div id="nomessage">
                            <div class="texto">
                                Você não tem nenhuma mensagem
                            </div>
                            <div class="text-center">
                                <figure>
                                    <img src="<?= HOME . VENDOR ?>site-maocheia/public/assets/svg/artcaixavazia.svg"
                                         alt="nenhuma mensagem">
                                </figure>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <div class="message-input">
        <div class="wrap">
            <input type="text" placeholder="Digite uma mensagem..."/>
            <!--                <i class="material-icons" style="padding: 13px;">link</i>-->
            <button class="submit"><i class="material-icons" style="padding: 3px 5px;">send</i></button>
        </div>
    </div>
    <div class="message-input-buy">
        <div class="pb-2 float-left col p-0">
            <div class="btn-not-buy">Ignorar</div>
            <div class="theme btn-buy">
                <div class="btn-buy-txt">responder</div>
                <div class="btn-buy-number">1</div>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
                    <g transform="translate(0 0.373)">
                        <g transform="translate(0 -0.373)">
                            <path d="M21,10.5a10.519,10.519,0,1,1-3.392-7.727A10.5,10.5,0,0,1,21,10.5Z"
                                  transform="translate(0)" fill="#f0cd00"/>
                            <path d="M36.485,10.644A10.5,10.5,0,0,1,26.376,21.137a10.5,10.5,0,0,1,0-20.985A10.5,10.5,0,0,1,36.485,10.644Z"
                                  transform="translate(-15.485 -0.144)" fill="#ffde50"/>
                            <path d="M46.185,31.358,31.349,46.194a10.545,10.545,0,0,1-1.33-1.794L44.392,30.028A10.5,10.5,0,0,1,46.185,31.358Z"
                                  transform="translate(-28.577 -28.585)" fill="#ffea94"/>
                            <path d="M99.562,85.947,85.947,99.562a10.486,10.486,0,0,1-2.658-1.527L98.035,83.289A10.467,10.467,0,0,1,99.562,85.947Z"
                                  transform="translate(-79.286 -79.286)" fill="#ffea94"/>
                            <path d="M65.03,56.871a8.159,8.159,0,0,1-16.317.1c0-.033,0-.067,0-.1a8.159,8.159,0,0,1,8.159-8.159h.1a8.121,8.121,0,0,1,4.6,1.488,8.213,8.213,0,0,1,2.248,2.391A8.12,8.12,0,0,1,65.03,56.871Z"
                                  transform="translate(-46.371 -46.371)" fill="#faa300"/>
                            <path d="M62.64,51.1,51.1,62.64a8.13,8.13,0,0,1-2.389-5.669c0-.033,0-.067,0-.1a8.159,8.159,0,0,1,8.159-8.159h.1a8.121,8.121,0,0,1,4.6,1.488A8.234,8.234,0,0,1,62.64,51.1Z"
                                  transform="translate(-46.371 -46.371)" fill="#ffbd00"/>
                            <path d="M217.528,56.871a8.159,8.159,0,0,1-8.159,8.159q-.232,0-.461-.013a8.159,8.159,0,0,0,0-16.293q.229-.013.461-.013A8.159,8.159,0,0,1,217.528,56.871Z"
                                  transform="translate(-198.869 -46.371)" fill="#f68e00"/>
                        </g>
                        <g transform="translate(3.973 3.6)">
                            <path d="M7.189,1,5.5,5.5,1,7.189,5.5,8.876l1.688,4.5,1.688-4.5,4.5-1.688L8.876,5.5Z"
                                  transform="translate(-1 -0.603)" fill="#f68e00"/>
                            <path d="M7.189,1,5.5,5.5,1,7.189,5.5,8.876l1.688,4.5,1.688-4.5,4.5-1.688L8.876,5.5Z"
                                  transform="translate(-0.603 -1)" fill="#fff3c2"/>
                        </g>
                    </g>
                </svg>
            </div>
        </div>
    </div>
</div>