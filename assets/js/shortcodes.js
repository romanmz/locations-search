!function(e){var t={};function n(r){if(t[r])return t[r].exports;var a=t[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){e.exports=n(1)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();var a=function(){function e(t,n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.map=t,this.location=n,this.position={lat:n.lat,lng:n.lng},this.marker=new google.maps.Marker({map:t.map,position:new google.maps.LatLng(n.lat,n.lng),label:n.title}),this.infoWindow=this.addInfoWindow(n.info_window),this.deactivate(),google.maps.event.addListener(this.marker,"click",this.onClick.bind(this))}return r(e,[{key:"addInfoWindow",value:function(e){return e?new google.maps.InfoWindow({position:new google.maps.LatLng(this.position.lat,this.position.lng),content:e,pixelOffset:new google.maps.Size(0,-30)}):null}},{key:"activate",value:function(){this.location.images.marker_active&&this.replaceIcon(this.location.images.marker_active),this.infoWindow&&this.infoWindow.open(this.map.map)}},{key:"deactivate",value:function(){this.location.images.marker&&this.replaceIcon(this.location.images.marker),this.infoWindow&&this.infoWindow.close()}},{key:"replaceIcon",value:function(e){var t={url:e.url,size:new google.maps.Size(e.size[0],e.size[1]),scaledSize:new google.maps.Size(e.scaledSize[0],e.scaledSize[1]),origin:new google.maps.Point(e.origin[0],e.origin[1]),anchor:new google.maps.Point(e.anchor[0],e.anchor[1]),labelOrigin:new google.maps.Point(e.labelOrigin[0],e.labelOrigin[1])};this.marker.setIcon(t),this.infoWindow&&this.infoWindow.setOptions({pixelOffset:new google.maps.Size(0,-1*t.scaledSize.height)})}},{key:"delete",value:function(){this.deactivate(),this.marker.setMap(null)}},{key:"onClick",value:function(){this.map.markers.forEach(function(e){return e.deactivate()}),this.activate(),this.map.checkZoomLevel()}}]),e}(),o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();var i=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.container=t,this.map=new google.maps.Map(t,{styles:locsearch.map_attributes.styles}),this.markers=[],"function"==typeof MarkerClusterer&&locsearch.map_attributes.clusters_image?this.markerClusterer=new MarkerClusterer(this.map,[],locsearch.map_attributes.clusters_image):this.markerClusterer=null,this.resetMapLocation()}return o(e,[{key:"resetMapLocation",value:function(){this.map.setCenter({lat:locsearch.map_attributes.initial_lat,lng:locsearch.map_attributes.initial_lng}),this.map.setZoom(locsearch.map_attributes.max_zoom)}},{key:"checkZoomLevel",value:function(){var e=this.searchRadius?this.searchRadius.getBounds():new google.maps.LatLngBounds;this.markers.forEach(function(t){e.extend(t.marker.getPosition())}),this.map.fitBounds(e),this.map.getZoom()>locsearch.map_attributes.max_zoom&&this.map.setZoom(locsearch.map_attributes.max_zoom)}},{key:"addMarkersFromLocations",value:function(e){var t=this;this.removeAllMarkers(),this.markers=e.map(function(e){return new a(t,e)}),this.markerClusterer&&this.markerClusterer.addMarkers(this.markers.map(function(e){return e.marker})),this.checkZoomLevel()}},{key:"removeAllMarkers",value:function(){this.markers.forEach(function(e){return e.delete()}),this.markers=[],this.markerClusterer&&this.markerClusterer.clearMarkers()}},{key:"drawRadius",value:function(e,t,n){return this.searchRadius&&this.searchRadius.setMap(null),this.searchRadius=new google.maps.Circle({strokeWeight:0,fillColor:"#FF0000",fillOpacity:.1,map:this.map,center:{lat:e,lng:t},radius:1e3*n,editable:!0}),this.checkZoomLevel(),google.maps.event.addListener(this.searchRadius,"radius_changed",this.radiusResized.bind(this)),google.maps.event.addListener(this.searchRadius,"center_changed",this.radiusMoved.bind(this)),this.searchRadius}},{key:"radiusResized",value:function(){this.searchRadius.getRadius()>1e3*locsearch.map_attributes.max_radius&&this.searchRadius.setRadius(1e3*locsearch.map_attributes.max_radius),this.checkZoomLevel()}},{key:"radiusMoved",value:function(){this.checkZoomLevel()}}]),e}(),s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();var c=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}return s(e,null,[{key:"requestLocation",value:function(){var e=this;return new Promise(function(t,n){navigator.geolocation.getCurrentPosition(function(n){sessionStorage.setItem("userLat",n.coords.latitude),sessionStorage.setItem("userLng",n.coords.longitude),t(e.cachedLocation)},function(e){n(Error(e.message))},{enableHighAccuracy:!1,timeout:1e4,maximumAge:0})})}},{key:"cachedLocation",get:function(){return null===sessionStorage.getItem("userLat")||null===sessionStorage.getItem("userLng")?null:{lat:parseFloat(sessionStorage.getItem("userLat")),lng:parseFloat(sessionStorage.getItem("userLng"))}}}]),e}(),u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();var l=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}return u(e,null,[{key:"reverseQuery",value:function(e,t){}},{key:"query",value:function(e){var t=this;return new Promise(function(n,r){var a={};a.address=e.trim(),a.componentRestrictions={},locsearch.map_attributes.focus_country&&!locsearch.map_attributes.focus_strict&&(a.region=locsearch.map_attributes.focus_country),locsearch.map_attributes.focus_country&&locsearch.map_attributes.focus_strict&&(a.componentRestrictions.country=locsearch.map_attributes.focus_country),a.address||r(Error(locsearch.alerts.empty_address)),t.geocoder.geocode(a,function(e,a){"OK"!=a&&r(Error(t.translateError(a))),n(e)})})}},{key:"translateError",value:function(e){return"INVALID_REQUEST"==e?locsearch.alerts.invalid_request:"OVER_QUERY_LIMIT"==e?locsearch.alerts.query_limit:"ZERO_RESULTS"==e?locsearch.alerts.no_results:"OK"!=e?locsearch.alerts.unknown_error:void 0}},{key:"geocoder",get:function(){return delete this.geocoder,this.geocoder=new google.maps.Geocoder}}]),e}(),h=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();var f=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}return h(e,null,[{key:"getGeocodeData",value:function(e){var t={country:"country",administrative_area_level_1:"state",postal_code:"postcode",locality:"city"},n=e.types.find(function(e){return t[e]});if(n){var r=e.address_components.find(function(e){return e.types.includes(n)});return{code:r.short_name,name:r.long_name,field:t[n]}}return null}},{key:"query",value:function(e,t,n){return new Promise(function(r,a){var o={action:"locations_map_search",lat:e,lng:t,search_radius:n};if("function"==typeof fetch){var i=new Headers({Accept:"application/json"}),s=new FormData;for(var c in o)o.hasOwnProperty(c)&&s.append(c,o[c]);fetch(locsearch.ajax_url,{method:"POST",headers:i,body:s}).then(function(e){return e.ok||a(Error(e.statusText)),e.json()}).then(r).catch(a)}else jQuery.post({url:locsearch.ajax_url,data:o,dataType:"json",error:function(e,t,n){a(Error("Error: "+n))},success:function(e,t,n){r(e)}})})}}]),e}(),d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};jQuery(document).ready(function(e){"object"===("undefined"==typeof google?"undefined":d(google))?(e(".locsearch_map").each(function(){new i(this).addMarkersFromLocations(e(this).data("locations"))}),e(".locsearch_box").each(function(){var t=e(this),n=t.find(".locsearch_box__form"),r=t.find(".locsearch_box__messages"),a=t.find(".locsearch_box__map"),o=n.find("input[name=address]"),s=new i(a[0]);function u(){t.data("isLocked",!0),t.addClass("locsearch_box--loading"),t.find(":input").prop("disabled",!0)}function h(){t.data("isLocked",!1),t.removeClass("locsearch_box--loading"),t.find(":input").prop("disabled",!1)}function d(e){g(e.lat,e.lng,locsearch.map_attributes.search_radius,locsearch.text.your_location)}function m(t){1===t.length?p(t[0]):t.length>1&&function(t){r.html("<p>"+locsearch.text.did_you_mean+"</p>");var n=e("<ul>");t.forEach(function(t){var r=e("<li>"),a=e("<a>",{href:"#",text:t.formatted_address});a.on("click",function(e){e.preventDefault(),p(t)}),n.append(r.append(a))}),r.append(n)}(t)}function p(e){g(e.geometry.location.lat(),e.geometry.location.lng(),locsearch.map_attributes.search_radius,e.formatted_address)}function g(e,n,a,o){var i=!(arguments.length>4&&void 0!==arguments[4])||arguments[4];if(!t.data("isLocked")){if(u(),r.html(o?"<p>"+locsearch.text.searching_near+" "+o+"</p>":""),i){var c=s.drawRadius(e,n,a),l=function(){g(c.getCenter().lat(),c.getCenter().lng(),c.getRadius()/1e3,"",!1)};google.maps.event.addListener(c,"radius_changed",l),google.maps.event.addListener(c,"center_changed",l)}f.query(e,n,a).finally(h).then(v).catch(function(e){return alert("Error: "+e.message)})}}function v(e){e.length?1==e.length?r.append("<p>"+locsearch.text["1_result"]+"</p>"):r.append("<p>"+locsearch.text.many_results.replace("%s",e.length)+"</p>"):r.append("<p>"+locsearch.text["0_results"]+"</p>"),s.addMarkersFromLocations(e)}n.on("submit",function(e){var n;e.preventDefault(),n=o.val(),t.data("isLocked")||(u(),l.query(n).finally(h).then(m).catch(function(e){return alert("Error: "+e.message)}))}),n.data("locsearch-autosearch")?n.trigger("submit"):c.cachedLocation?d(c.cachedLocation):""==o.val().trim()&&c.requestLocation().then(d).catch(function(e){})})):alert(locsearch.alerts.api_unavailable)})}]);
//# sourceMappingURL=shortcodes.js.map