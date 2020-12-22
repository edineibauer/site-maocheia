<section class="container">
    <div class="row">
        <a href="#back" data-animation="back" class="col-12 volta">
            <i class="material-icons float-left pl-2 pr-2">arrow_back</i>
            <h5 class="float-left py-3 mt-2 font-weight-bold">feedback do app</h5>
        </a>
    </div>
    <div class="row">
        <div class="col-12">
            <form id="formFeedback" method="POST" action="">
                <div class="row justify-content-center">
                    <div class="form-group col-12 col-lg-12">
                        <textarea class="form-control" id="feedback"
                                  placeholder="Deixe seu comentário sobre o aplicativo." rows="8"></textarea>
                    </div>
                </div>
                <div class="row justify-content-center">
                    <div class="form-group col-12 col-lg-6">
                        <button id="feed" type="submit" class="btn btn-primary">Enviar</button>
                    </div>
                </div>
            </form>
        </div>
        <div id="resultado"></div>
    </div>
</section>
