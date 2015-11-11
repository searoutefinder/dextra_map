<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
	<meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <meta name="description" content="">
    <meta name="author" content="">	
	<title>Dextra map app</title>
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap.min.css"></link>
	<link href='//fonts.googleapis.com/css?family=Raleway' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="css/default.css"></link>
</head>
<body> 

<header>
    <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#">DEXTRA</a>
            </div>
            <div id="navbar" class="collapse navbar-collapse">
                <ul class="nav navbar-nav">
					<li><a href="javascript:void(0)">Hi Tamas Hajdu</a></li><li><a href="?logout" id="hdr-btn-logout">Log out</a></li>					
                </ul>
            </div><!--/.nav-collapse -->
        </div>
    </nav>
</header>

<main class="content-wrapper">
    
	<div class="btn-slider" data-open="1">
		<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
	</div>		
	
	<div id="tabs" class="tabs open" role="tabpanel">
        <!-- Nav tabs -->
        <ul class="nav nav-tabs" role="tablist" id="list-options">
            <li role="presentation" id="li-map" class="active">
                <a href="javascript:void(0)" id="btn-map" aria-controls="tab-latest" role="tab" data-toggle="tab">Map</a>
            </li>
            <li role="presentation" id="li-investigations">
                <a href="#enter-details-tab" id="btn-controls" aria-controls="tab-latest" role="tab" data-toggle="tab">Settings</a>
            </li>
            <li role="presentation" id="li-investigations">
                <a href="#results-tab" id="btn-results" aria-controls="tab-latest" role="tab" data-toggle="tab">Data</a>
            </li>			
        </ul>	
		
        <!-- Tab panes -->
        <div class="tab-content">
            <!-- Latest pets tab -->
            <div role="tabpanel" class="tab-pane active" id="enter-details-tab">
                <div class="row box sidebar-header-container">
                    <img src="img/dextra_logo_thumb.png" alt="Add address marker"/>
                    <h1 class="sidebar-header">DEXTRA MAPPING APP</h1>
                </div>
                    <div class="row box">
                        <div class="col-sm-12 col-xs-12 col-md-12 col-lg-12">
                            <span class="fill-message"><strong>CONFIGURACÕES</strong></span>
                        </div>
                        <div class="col-sm-12 col-xs-12 col-md-12 col-lg-12">
						    <label for="sel_locationmed">Dados de localização</label>
							<select class="form-control input-sm form-elem" id="sel_locationmethod">
                                <option disabled selected>Entre com os dados de localização</option>
                                <option value="address">Address</option>
                                <option value="coordinates">Coordinates</option>
                            </select>
						</div>						
                        <div class="col-sm-12 col-xs-12 col-md-12 col-lg-12">
                            <input type="text" class="input-sm form-control form-elem" placeholder="Address" id="inp_location"/>
                        </div>
                        <div class="col-sm-12 col-xs-12 col-md-12 col-lg-12">
                            <input type="text" class="input-sm form-control form-elem" placeholder="Coordinates (LAT,LNG)" id="inp_location_coordinates"/>
                        </div>
                        <div class="col-sm-12 col-xs-12 col-md-12 col-lg-12 control-row">
							<label>Incluir Torres Existentes</label>
						</div>							
						<div class="col-sm-12 col-xs-12 col-md-12 col-lg-12">
							<div class="col-sm-6 col-xs-6 col-md-6 col-lg-6 text-center">
							    <label class="radio-inline">
                                    <input type="radio" name="towers" id="towers1" value="true"> Sim
                                </label>
                            </div>
							<div class="col-sm-6 col-xs-6 col-md-6 col-lg-6 text-center">
							    <label class="radio-inline">
                                    <input type="radio" name="towers" id="towers0" value="false" checked="checked"> Não
                                </label>
						    </div>
						</div>						
						<div class="col-sm-12 col-xs-12  col-md-12 col-lg-12 control-row">
						    <label for="radius-slider">Determinar Raio de Busca<span id="spn-rad-val"> (300m)</span></label>
						    <input id="radius-slider" data-slider-id='radius-slider' type="text" data-slider-min="0" data-slider-max="1000" data-slider-step="1" data-slider-value="300"/>
						</div>

						<div class="col-sm-12 col-xs-12  col-md-12 col-lg-12 sidebar-lower-container">
                            <button class="col-sm-12 col-xs-12  col-md-12 col-lg-12 btn btn-success btn-submit" id="btn_search">PROCURAR</button>
                            <div class="col-sm-12 col-xs-12  col-md-12 col-lg-12 separator"></div>
												
							<p class="result-toggle col-sm-12 col-xs-12  col-md-12 col-lg-12 text-center">
							    No search has been conducted
								<!--<span class="search-cat-msg">Sites found </span>
								<span class="site-amt">(0)</span> - <a href="#" data-toggle="modal" data-target="#siteResultModal">Show</a>-->
							</p>
							
							<div class="col-sm-12 col-xs-12  col-md-12 col-lg-12 separator"></div>						
                        </div>
                    </div>
            </div>
			<div role="tabpanel" class="tab-pane" id="results-tab">
			    <p>Data tab here</p>
			</div>
        </div>
    </div>
    <div id="map" class="google-map"></div>
</main>

    <div class="modal fade" id="siteResultModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Sites list<span id="sites-count"></span></h4>						
                </div>			
                <div class="modal-body">
				    <div class="text-center col-xs-12 col-sm-12 col-md-12 col-lg-12">
					    <button type="button" class="btn btn-success btn-sm print-btn" id="btn_print">Print</button>
				        <button type="button" class="btn btn-success btn-sm export-btn" id="btn_export">CSV</button>
					</div>	
                    <table class="table table-hover table-responsive">
                        <thead id="site-result-header"></thead>
			            <tbody id="site-result-table"></tbody>
					</table>	
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

    <div class="modal fade" id="towerResultModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Towers list<span id="towers-count"></span></h4>				
                </div>
                <div class="modal-body">
                    <table class="table table-hover table-responsive">
                        <thead>
							    <th>Operadora</th>
								<th>Name</th>
								<th>Estacao</th>
								<th>Distance</th>
			            </thead>
			            <tbody id="tower-result-table"></tbody>
					</table>	                    
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
	
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/js/bootstrap.min.js"></script>
	<script src="//maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=places"></script>
	<script src="//libs.cartocdn.com/cartodb.js/v3/3.12/cartodb.js"></script>
	<script src="js/bootstrap-slider.js"></script>
	<script src="js/html2canvas.min.js"></script>
	<script src="js/pdfmake.min.js"></script>
	<script src="js/vfs_fonts.js"></script>
	<script src="js/mustache.min.js"></script>
	<script src="js/app.js"></script>
	<script>
        google.maps.event.addDomListener( window, 'load', dextraMap.init() );	
		
		//Open/Close sidebar slider
		$(".btn-slider").on("click", function(){
			if($(this).attr("data-open") == '1'){
				$(this)
					.css({'right': '0px'})
					.attr("data-open", "0")
					.find('span')
					.removeClass('glyphicon-chevron-right')
					.addClass('glyphicon-chevron-left');
					
				$(".tabs").removeClass('open').addClass('closed');	
				$("#map").css({'right': '0px'});	
				dextraMap.resize();
			}
			else if($(this).attr("data-open") == '0'){
				$(this)
					.css({'right': '450px'})
					.attr("data-open", "1")
					.find('span')
					.removeClass('glyphicon-chevron-left')
					.addClass('glyphicon-chevron-right');
					
				$(".tabs").removeClass('closed').addClass('open');	
				$("#map").css({'right': '450px'});	
				dextraMap.resize();
			}			
		});	
		

		$("#btn-map").on('click', function(){
            $(".google-map").css({'z-index': 10});
            $(".tabs").css({'z-index': 5});
        });

        $("#btn-controls").on('click', function(){
            $(".google-map").css({'z-index': 5})
            $(".tabs").css({'z-index': 10});
        });			
		
        $("#btn-results").on('click', function(){
            $(".google-map").css({'z-index': 5})
            $(".tabs").css({'z-index': 10});
        });

        //Initiate radius slider
        $('#radius-slider').slider({
		    tooltip: 'hide',
	        formatter: function(value) {
		        return value + ' m';
	        }
        });
        $("#radius-slider").on("slide", function(slideEvt){
			$("#spn-rad-val").text(" (" + slideEvt.value + "m)");
			dextraMap.addRadius(slideEvt.value);
		});
	
	    //Location method changes event
	    $("#sel_locationmethod").on("change", function(){
		    switch($(this).val()){
			    case "address":
				    $("#inp_location_coordinates").hide("fast", function(){
					    dextraMap.destroyLocation();
						$(this).val('');
						$("#inp_location").show("fast", function(){
						    $(this).focus();
						});
					});			    
				break;
				case "coordinates":
				    $("#inp_location").hide("fast", function(){
					    dextraMap.destroyLocation();
						$(this).val('');
					    $("#inp_location_coordinates").show("fast", function(){
						    $(this).focus();
						});
					});					
				break;
			}
		});
		
		$("#inp_location").on("show", function(){
		    dextraMap.addAutocomplete(new google.maps.places.Autocomplete($(this).get(0), {types: ['geocode'], componentRestrictions: {country: 'br'}}));
		});
		$("#inp_location_coordinates").on("blur", function(){
			dextraMap.addCoordinate($(this).val());   
		});	
		$("#inp_location_coordinates").on("input", function(e){
			var regex = /^[0-9.,-]+$/;
			var test = new RegExp(regex);
			if($(this).val().match(test) != null){
			    //Input is in the right format, yuhuuu
			}
			else
			{
			    $(this).val($(this).val().slice(0,-1));
			}
		});				
		
		$("input[name='towers']").change(function(){
		    dextraMap.addTowerSearch($(this).val());
		});
		
        $('#siteResultModal').on('shown.bs.modal', function() {
			$("#btn_print").off().on("click", function(){
				dextraMap.printMap();
		    });      
        });		
	
	    $("#btn_export").on("click", function(){
		    if(dextraMap.getMode()){
			    //Results include towers
				dextraMap.downloadCSV({advanced: true, filename: "sites__towers_export.csv"});
			}
			else
			{
			    //Results do not include towers
				dextraMap.downloadCSV({advanced: false, filename: "sites_export.csv"});
			}
		});
	
		$("#btn_search").on("click", function(){
		    if(!dextraMap.validate()){return false;}
		    
			//Clear map contents
			dextraMap.clearMap();
						
			if(dextraMap.showTowers()){
			    //This branch gets executed when the user wants to display sites as well as towers, complex query
				var towers = dextraMap.getTowers();
		        towers.done(function(data){
		            //console.log(data);
					dextraMap.displayTowers(data);
		        })
			    .error(function(done){
			
			    });
			}
            else
			{
			    //This branch gets executed when the user only wants to display sites and no towers
			    var sites = dextraMap.getSites();
		        sites.done(function(data){
		            dextraMap.displaySites(data);
		        })
			    .error(function(errors){
			        alert("We have been experiencing some errors in the workflow: " + errors);
			    });			
			}
		});
	</script>
</body>
</html>