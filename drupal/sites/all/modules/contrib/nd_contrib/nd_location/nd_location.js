
Drupal.ND_location = Drupal.ND_location || {};

Drupal.ND_location.open_gmap_bubble = function(longitude, latitude) {
  var map = Drupal.gmap.getMap('auto1map');
  for (i = 0; i < map.vars.markers.length; i++){
    if (map.vars.markers[i]['longitude'] == longitude && map.vars.markers[i]['latitude'] == latitude) {
      var html = map.vars.markers[i].text;
      map.vars.markers[i].marker.openInfoWindowHtml(html);
      break;
    }
  }
  map.change('move', -1);
}