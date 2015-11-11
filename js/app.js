(function ($) {
      $.each(['show', 'hide'], function (i, ev) {
        var el = $.fn[ev];
        $.fn[ev] = function () {
          this.trigger(ev);
          return el.apply(this, arguments);
        };
      });
    })(jQuery);
var cartoObject = (function(){
    var settings = {
	    user: "dextra",
		tables: {
		    "sites": "dextra_sites",
			"towers": "towers"
		}
	};

	function initSQL(){
	    return new cartodb.SQL({user: settings.user});
	}
	return {
	    init: initSQL
	}
})();
	
var dextraMap = (function () {
 
        var map = null;
 		var vars = {
		    map: null,
			autocomplete: null,
			userlocation: null,
			useraddress: null,
			locationmarker: new google.maps.Marker({flat:true, optimized:false,visible:true,icon:{'url': 'img/bluedot_retina.png', size: new google.maps.Size(17,17), origin: new google.maps.Point(0,0), anchor: new google.maps.Point(8, 8)}, title: 'Local'}),
			radius: 300,
			towers: false,
			content: {
			    towers: [],
				sites: []
			},
			print:{
			    advanced: false,
			    data: null,
				csv: null
			},
			pdf: {}
		};
		
		function privateAdjustBoundsToRecords(bounds){
			var bounds_ = new google.maps.LatLngBounds();
			bounds_.extend(vars.userlocation);
			bounds_.extend(new google.maps.LatLng(bounds[0][0], bounds[0][1])); 
			bounds_.extend(new google.maps.LatLng(bounds[1][0], bounds[1][1]));
				
			vars.map.fitBounds(bounds_);		
		}
		function privateUseAutocompleteLocation(){
		    var place = this.getPlace();
			//console.log(place["formatted_address"]);
			vars.userlocation = place.geometry.location;
			vars.useraddress = place["formatted_address"];
		}
		function privateUseCoordinateLocation(latlng){
		    vars.userlocation = latlng;
			vars.useraddress = "(" + latlng.toUrlValue() + ")";
		}
		function publicNeedsTowers(){
		    return vars.towers;
		}
		function publicDestroyLocation(){
		    vars.userlocation = null;
			vars.useraddress = null;
		}
		function publicInit(){
	        var mapOptions = { zoom: 4, center: new google.maps.LatLng(-10.557633, -51.788330), styles: [{"featureType": "transit","stylers": [{ "visibility": "off" }]},{featureType: "poi",stylers: [{ visibility: "off" }]}]};
	        vars.map = new google.maps.Map(document.getElementById('map'), mapOptions);	
            vars.locationmarker.setMap(vars.map);
		}
		function publicResize(){
		    google.maps.event.trigger(vars.map, "resize");
		}
        function publicAddAutocomplete(autocompleteObj){
		    publicDestroyLocation();    //Destroy stored location if it is not empty
			vars.autocomplete = autocompleteObj;
			google.maps.event.clearListeners(vars.autocomplete, 'place_changed');
			//Store location from autocomplete input in the app
			google.maps.event.addListener(vars.autocomplete, "place_changed", privateUseAutocompleteLocation);
		}
        function publicAddCoordinateLocation(coordinateInput){
		    var coordinates = coordinateInput.split(",");
			if(coordinates.length<2){
			    return;
			}
			else
			{
			    var latitude = parseFloat(coordinates[0]).toFixed(3);
				var longitude = parseFloat(coordinates[1]).toFixed(3);
				//Store location from coordinate input in the app
				privateUseCoordinateLocation(new google.maps.LatLng(latitude, longitude));
			}
		}
        function publicAddRadiusValue(radius){
            vars.radius = radius;
		}
        function publicAddTowerSearch(towers){		   
			vars.towers = (towers == "true") ? true : false;
		}
        function publicValidateInputData(){	
            var fields = [vars.userlocation, vars.radius, vars.towers];
			if($.inArray(null, fields)>-1){return false;}
			return true;
		}
		function publicFetchSites(){
		    var cartoDB_Handler = cartoObject.init();
			var requestSQL = "SELECT cartodb_id as siteid, nmcondo,cep,referencia,ST_AsGeoJSON(the_geom) AS geom, the_geom, FLOOR(ST_Distance_Sphere(the_geom, ST_GeomFromText('POINT({{lng}} {{lat}})',4326))) AS d  FROM sites WHERE ST_Distance_Sphere(the_geom, ST_GeomFromText('POINT({{lng}} {{lat}})',4326)) < {{radius}} ORDER BY d ASC"
			vars.locationmarker.setOptions({position: vars.userlocation});
			var request = cartoDB_Handler.execute(requestSQL, {lat: vars.userlocation.lat(), lng: vars.userlocation.lng(), radius: vars.radius});
			
			//Adjust the bounds to current returned dataset
			cartoDB_Handler.getBounds(requestSQL, {lat: vars.userlocation.lat(), lng: vars.userlocation.lng(), radius: vars.radius}).done(function(bounds) {       
                privateAdjustBoundsToRecords(bounds);
            });			
			
			return request;
		}
		function publicFetchTowers(){
		    var cartoDB_Handler = cartoObject.init();
			//var requestSQL = "SELECT operadora, name, estacao, ST_AsGeoJSON(the_geom) AS geom, the_geom, FLOOR(ST_Distance_Sphere(the_geom, ST_GeomFromText('POINT({{lng}} {{lat}})',4326))) AS d  FROM towers WHERE ST_Distance_Sphere(the_geom, ST_GeomFromText('POINT({{lng}} {{lat}})',4326)) < {{radius}} ORDER BY d ASC"
			var requestSQL = "SELECT g2.cartodb_id AS siteid, ST_AsGeoJson(g2.the_geom) AS sitegeom, g1.cartodb_id AS towerid,g1.operadora AS tower_operator,FLOOR(st_distance_sphere(g1.the_geom,g2.the_geom)) as tower_distance_from_site, g2.d AS site_distance_from_location, ST_AsGeoJSON(g1.the_geom) AS towergeom, g1.the_geom AS tgeom FROM (SELECT cartodb_id, operadora, the_geom, FLOOR(ST_Distance_Sphere(the_geom, ST_SetSRID(ST_MakePoint({{lng}},{{lat}}), 4326))) AS d_ FROM towers WHERE FLOOR(ST_Distance_Sphere(the_geom, ST_SetSRID(ST_MakePoint({{lng}},{{lat}}), 4326))) < {{radius}} ORDER BY d_ ASC LIMIT 5) AS g1,(SELECT cartodb_id, nmcondo,cep,referencia,the_geom, FLOOR(ST_Distance_Sphere(the_geom, ST_SetSRID(ST_MakePoint({{lng}},{{lat}}), 4326))) AS d  FROM sites WHERE FLOOR(ST_Distance_Sphere(the_geom, ST_SetSRID(ST_MakePoint({{lng}},{{lat}}), 4326))) < {{radius}}) AS g2 ORDER BY site_distance_from_location ASC";
			vars.locationmarker.setOptions({position: vars.userlocation});
			var request = cartoDB_Handler.execute(requestSQL, {lat: vars.userlocation.lat(), lng: vars.userlocation.lng(), radius: vars.radius});

			//Adjust the bounds to current returned dataset
			var boundsSQL = "SELECT the_geom FROM towers WHERE FLOOR(ST_Distance_Sphere(the_geom, ST_SetSRID(ST_MakePoint({{lng}},{{lat}}), 4326))) < {{radius}}";
			cartoDB_Handler.getBounds(boundsSQL, {lat: vars.userlocation.lat(), lng: vars.userlocation.lng(), radius: vars.radius}).done(function(bounds) {       
                privateAdjustBoundsToRecords(bounds);
            });		
			
			return request;
		}		
		function publicDisplaySites(data){
		    //Parse the response from cartodb here
			if(data.rows.length == 0){
			    $(".result-toggle").html('Nenhum resultado encontrado');
				return;
			}
			
			//Display results count both in the sidebar and in the modal title
			$("#sites-count").html(" (" + data.total_rows + ")");
			
			//Display result count in the sidebar
			$(".result-toggle").html('Sites encontrados <span class="site-amt">(' + data.total_rows + ')</span> - <a href="#" data-toggle="modal" data-target="#siteResultModal">Mostrar</a>');
			
			//Loop through the site results, and add a marker on the map for each
			for(i=0;i<data.rows.length;i++){
			    var locJSON = JSON.parse(data.rows[i]["geom"]);
				
				var marker = new google.maps.Marker({
				    map: vars.map, 
					icon: {url: 'img/marker_site.png', size: new google.maps.Size(32, 32), origin: new google.maps.Point(0, 0), anchor: new google.maps.Point(16, 16)}, 
					position: new google.maps.LatLng(locJSON["coordinates"][1], locJSON["coordinates"][0]),
					attributes: {
					    siteid: data.rows[i]["siteid"],
						nmcondo: data.rows[i]["nmcondo"],
						cep: data.rows[i]["cep"],
						referencia: data.rows[i]["referencia"],
						distanceFromSearchLocation: data.rows[i]["d"] 
					}					
				});
				vars.content.sites.push(marker);
			}
			
			//Write data to a table
			privateSimpleRowsToTable();
			
			//Write rows to the CSV variable too
			privateSimpleRowsToCSV();
			
			//Set print mode
			vars.print.advanced = false;
		}
		function publicDisplayTowers(data){
		    //Parse the response from cartodb here
			if(data.rows.length == 0){
			    $(".result-toggle").html('Nenhum resultado encontrado');
				return;
			}
			
			
			$("#site-result-header").html('');
			$("#site-result-table").html('');
			publicEraseMapContents();
			
			var rows = {header: ['SiteID', 'Local'], body: []};
			
			//Fill the header and display the towers
			for(i=0;i<5;i++){
			    if(data.rows[i]){
				    var operadora_short = data.rows[i]['tower_operator'].split(' ');
				    rows.header.push(operadora_short[0]);
					
					//Collect towers to display
				    var locJSON = JSON.parse(data.rows[i]["towergeom"]);
				    var marker = new google.maps.Marker({
				        map: vars.map, 
					    icon: {url: privateColorTowers(data.rows[i]['tower_operator']), size: new google.maps.Size(16, 16), origin: new google.maps.Point(0, 0), anchor: new google.maps.Point(8, 8)}, 
					    position: new google.maps.LatLng(locJSON["coordinates"][1], locJSON["coordinates"][0]),
					    title: data.rows[i]["tower_operator"],
					    attributes: {
						    distanceFromSearchLocation: data.rows[i]["tower_distance_from_site"] 
					    }
				    });		
                    vars.content.towers.push(marker);
				}
			}
			
			//Loop through the results with a 5 step interval to collect all the sites
			for(i=0;i<data.rows.length;i+=5){
			   var row = [String(data.rows[i]["siteid"]), String(data.rows[i]["site_distance_from_location"])];
				
				//Collect all the distances of the towers from the given site
				for(j=0;j<5;j++){
				    row.push(String(data.rows[i+j]['tower_distance_from_site']));
				}
				
				rows.body.push(row);
				
				//Add a site to the map
			    var locJSON = JSON.parse(data.rows[i]["sitegeom"]);
				
				var marker = new google.maps.Marker({
				    map: vars.map, 
					icon: {url: 'img/marker_site.png', size: new google.maps.Size(32, 32), origin: new google.maps.Point(0, 0), anchor: new google.maps.Point(16, 16)}, 
					position: new google.maps.LatLng(locJSON["coordinates"][1], locJSON["coordinates"][0]),
					attributes: {
					}					
				});
				vars.content.sites.push(marker);				
			}
			
			//Display result count in the sidebar
			$(".result-toggle").html('Sites encontrados <span class="site-amt">(' + vars.content.sites.length + ') Torres encontrados (' + vars.content.towers.length + ') </span> - <a href="#" data-toggle="modal" data-target="#siteResultModal">Mostrar</a>');
			
			//Write data to a table
			privateComplexRowsToTable(rows);
			
			//Assign to intermediary print var
			vars.print.data = rows;
			
			//Set print mode to 'advanced'
			vars.print.advanced = true;
			
			vars.print.csv = [];
			
			vars.print.csv.push(rows.header);
			vars.print.csv.push(rows.body);
			
		}
		function privateComplexRowsToTable(rows){
		    
		    //Delete the table contents first
			$("#site-result-header").html("");
			$("#site-result-table").html("");			
			
			$("#site-result-header").append($('<tr><th></th><th colspan="6" class="text-center">Distância (m)</th></tr>'));
		    var headerMainRow = $('<tr>');
			for(i=0;i<rows.header.length;i++){
			    headerMainRow.append('<th title="' + rows.header[i] + '">' + rows.header[i] + '</th>');
			}
			$("#site-result-header").append(headerMainRow);
			
			for(i=0;i<rows.body.length;i++){
			    var bodyRow = $('<tr>');
				for(j=0;j<rows.body[i].length;j++){
				    bodyRow.append($('<td>' + rows.body[i][j] + '</td>'));			 
				}
				$("#site-result-table").append(bodyRow);
			}						
		}
		function privateSimpleRowsToTable(){
		    //Delete the table contents first
			$("#site-result-header").html("");
			$("#site-result-table").html("");
			
			$("#site-result-header").append('<tr><th>Site ID</th><th title="NMCONDO">NMCONDO</th><th title="CEP">CEP</th><th title="Referencia">Referencia</th><th title="Distância">Distância</th></tr>');
			
			for(i=0;i<vars.content.sites.length;i++){
				$("#site-result-table").append(Mustache.render('<tr><td>{{siteid}}</td><td title="{{nmcondo}}">{{nmcondo}}</td><td title="{{cep}}">{{cep}}</td><td title="{{referencia}}">{{referencia}}</td><td title="{{distanceFromSearchLocation}}">{{distanceFromSearchLocation}}</td><tr>', vars.content.sites[i]['attributes']));
			}
		}
		function privateSimpleRowsToCSV(){
		    //Zero the container variable first
			vars.print.csv = [];
			
			//Then populate it
			for(i=0;i<vars.content.sites.length;i++){
			    var tpl = vars.content.sites[i]['attributes'];

			    vars.print.csv.push({"siteid": tpl.siteid, "nmcondo": tpl.nmcondo, "cep": tpl.cep, "referencia": tpl.referencia, "distance_from_location_m": tpl.distanceFromSearchLocation});
			}	
		}
		function privateClearTowersTable(){
		    $("#tower-result-table").html("");
		}
		function privateClearSitesTable(){
		    $("#site-result-table").html("");
		}		
		function publicEraseMapContents(){
			while(vars.content.sites[0]){
			    vars.content.sites.pop().setMap(null);
			}
			vars.content.sites.length = 0;
			while(vars.content.towers[0]){
			    vars.content.towers.pop().setMap(null);
			}
			vars.content.towers.length = 0;
            privateClearTowersTable();
            privateClearSitesTable();
		}				
		function privatePrintResults(imgUrl, data){

		   //Define the printing context
		    vars.pdf.content = [];
		
            //Define some printing styles
	        vars.pdf.styles = {
		        tableHeader: {
			        bold: true,
			        fontSize: 11,
			        color: 'black'
		        },
				tableRow: {
				    color:'black',
					fontSize: 10
				}
	        }
            
			//Append the image to the printable document
			vars.pdf.content.push({image: imgUrl, width:523});
            
			//Print in advanced mode including sites and towers
			if(vars.print.advanced){
			    //Append the following content if print mode is advanced
				vars.pdf.content.push({text: vars.useraddress, alignment: 'center', fontSize: 15, bold: true, margin: [0, 20, 0, 8]});
				vars.pdf.content.push({ text: 'Lista de sites e torres em um raio de ' + vars.radius + ' metros', fontSize: 14, bold: false, margin: [0, 20, 0, 8] });
				
				//Put together the header rows
				var rows = [                            
				    [{text: '', style: 'tableHeader'}, {text: 'Distância (m)', style: 'tableHeader', colSpan: 6, alignment: 'center'},{text: '', style: 'tableHeader'},{text: '', style: 'tableHeader'},{text: '', style: 'tableHeader'},{text: '', style: 'tableHeader'},{text: '', style: 'tableHeader'}],
                    []
				];
				
				//Populate the second row of the header with providers
				for(i=0;i<7;i++){
				    if(vars.print.data.header[i]){
					    rows[1].push({text: vars.print.data.header[i], style: 'tableHeader',alignment: 'center'});
					}
					else
					{
					    rows[1].push({text: '-', style: 'tableHeader',alignment: 'center'});
					}
				}

				//Then populate the table body with the distance values
                for(i=0;i<vars.print.data.body.length;i++){
				    var row = [];
					for(j=0;j<vars.print.data.body[i].length;j++){
					    row.push({text: vars.print.data.body[i][j], alignment: 'center'});
					}
					rows.push(row);
				}				
				
				//The put the whole thing we have just collected into context
				vars.pdf.content.push({
				    style: 'tableExample',
				    color: '#444',
				    table: {
					    widths: [45,45,73,73,73,73,73],
						headerRows: 2,
						body: rows
					}
				});
                
				//Before we print out the whole stuff and return
				pdfMake.createPdf(vars.pdf).download('dextra_sites_towers_print.pdf');	
				
			    //Revert to the original state before printing began
			    setTimeout(function(){
				    data.element.removeClass("google-map-full").addClass("google-map");				
				}, 2000);	
				
                return true;
			}
			
			//Simple printing mode, append the explanation text
			vars.pdf.content.push({ text: 'Lista de sites em um raio de ' + vars.radius + ' metros ' + vars.useraddress, fontSize: 14, bold: true, margin: [0, 20, 0, 8] });
			
			//Insert sites data header
		    var rows = [
			    [
				    { text: 'Site', style: 'tableHeader'}, 
					{ text: 'NMCONDO', style: 'tableHeader' },
					{ text: 'CEP', style: 'tableHeader' }, 
					{ text: 'Referencia', style: 'tableHeader'}, 
					{ text: 'Distância (m)', style: 'tableHeader' }
				]				
			];
			
			//Insert sites data int ot the table
			for(i=0;i<data.sites.length;i++){
			    rows.push([
					{ text: String(data.sites[i]["attributes"]["siteid"]), style: 'tableRow'},
				    { text: data.sites[i]["attributes"]["nmcondo"], style: 'tableRow'},
				    { text: data.sites[i]["attributes"]["cep"], style: 'tableRow'},
					{ text: String(data.sites[i]["attributes"]["referencia"]), style: 'tableRow'},
					{ text: String(data.sites[i]["attributes"]["distanceFromSearchLocation"]), style: 'tableRow'}
				]);
			}

			//Put it into the context
			vars.pdf.content.push({
				style: 'tableExample',
				table: {
					headerRows: 1,
					widths: [30, 102, 102, 132, 90],
					body: rows
				},
				layout: 'lightHorizontalLines'
			});
			
			//If print mode advanced is true set it to false
			vars.print.advanced = false;
			
            //Print sites copy PDF
			pdfMake.createPdf(vars.pdf).download('dextra_sites_print.pdf');	
            
			//Revert to the original state before printing began
			setTimeout(function(){
				data.element.removeClass("google-map-full").addClass("google-map");				
			}, 2000);
		}		
		function publicPreparePrint(){
            $("#map").removeClass("google-map").addClass("google-map-full");
			
			google.maps.event.addListenerOnce(vars.map, "tilesloaded", function(){
			    setTimeout(function(){
			       privatePrintMap();
				},2500);
			});
			google.maps.event.trigger(vars.map, "resize");		
		}		
		function privatePrintMap(){

			var element = document.getElementById('map');
			var $element = $("#map");

            html2canvas(element, {
                useCORS: true,
                onrendered: function(canvas) {
                    var dataUrl= canvas.toDataURL("image/png");
					privatePrintResults(dataUrl, {"sites": vars.content.sites, "towers": vars.content.towers, "element": $element});
                }
            });		
		}
		
        function privateConvertArrayToCSV(args) {
            var result, ctr, keys, columnDelimiter, lineDelimiter, data;
    
            data = args.data || null;
            if (data == null || !data.length) {
                return null;
            }
    
            columnDelimiter = args.columnDelimiter || ',';
            lineDelimiter = args.lineDelimiter || '\n';
			
            if(args.advanced){
			    console.log(data);
			    result = '';
				result += data[0].join(columnDelimiter);
				result += lineDelimiter;
				
				for(i=0;i<data[1].length;i++){
				    console.log(data[1][i]);
					result += data[1][i].join(columnDelimiter);
					result += lineDelimiter;
				}
				return result;
			}
			else
			{
			    keys = Object.keys(data[0]);
                result = '';
                result += keys.join(columnDelimiter);
                result += lineDelimiter;
        
                data.forEach(function(item) {
                    ctr = 0;
                    keys.forEach(function(key) {
                        if (ctr > 0) result += columnDelimiter;
        
                        result += item[key];
                        ctr++;
                    });
                    result += lineDelimiter;
                });
        
                return result;				
			}
        }
    
        function publicDownloadCSV(args) {
            var data, filename, link;
    
            var csv = privateConvertArrayToCSV({
                data: vars.print.csv,
				advanced: args.advanced
            });
            if (csv == null) return;
    
            filename = args.filename || 'export.csv';
    
            if (!csv.match(/^data:text\/csv/i)) {
                csv = 'data:text/csv;charset=utf-8,' + csv;
            }
            data = encodeURI(csv);
    
            link = document.createElement('a');
            link.setAttribute('href', data);
            link.setAttribute('download', filename);
            link.click();
        }		
		
		function publicGetMode(){
		    return vars.print.advanced;
		}
		
		function privateColorTowers(text){
		    var src = '';
			switch(true){
		        case text.indexOf('NEXTEL') > -1:
                    src = "img/orange.png";
				break;
                case text.indexOf('CLARO') >  -1:
				    src = "img/red.png";
				break;
                case text.indexOf('TIM') >  -1:
				    src = "img/blue.png";
				break;				
                case text.indexOf('BRASIL') >  -1:
				    src = "img/purple.png";
				break;	
                case (text.indexOf('TNL') >  -1) || (text.indexOf('M�VEL') >  -1):
				    src = "img/yellow.png";
				break;
                default:
				    src = "img/gray.png";
				break;
		    }
			if(src==''){return "img/gray.png";}
			
			return src;
		}
		
		return {
		    init: publicInit,
			resize: publicResize,
			addAutocomplete: publicAddAutocomplete,
			addCoordinate: publicAddCoordinateLocation,
			destroyLocation: publicDestroyLocation,
			addRadius: publicAddRadiusValue,
			addTowerSearch: publicAddTowerSearch,
			validate: publicValidateInputData,
			getSites: publicFetchSites,
			getTowers: publicFetchTowers,
			showTowers: publicNeedsTowers,
			displayTowers: publicDisplayTowers,
			displaySites: publicDisplaySites,
			printMap: publicPreparePrint,
			clearMap: publicEraseMapContents,
			getMode: publicGetMode,
			downloadCSV: publicDownloadCSV
        };
 
    })();