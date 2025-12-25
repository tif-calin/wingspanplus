
This contains all preprocessing and scraping scripts for data used by the project.

### Avibase
Regression analysis for wingspan and egg capacity.

1. For every official species, collect avibase lifehistory properties.
2. For each order that has at least 10 official species, run a regression analysis and see which properties are most predictive of [wingspan|egg capacity].
3. Derive prediction equations for each property that can be used on novel species.

### iNaturalist
Search for cc0 photos of a given taxon.
https://api.inaturalist.org/v1/observations?taxon_id=1289673&order_by=votes&quality_grade=research&photo_license=cc0&photos=true&page=&per_page=30

Or:
https://api.inaturalist.org/v2/observations?taxon_id=1289673&order_by=votes&quality_grade=research&photo_license=cc0&photos=true&page=&per_page=30&fields=(id:!t,photos:(id:!t,license_code:!t,url:!t,original_dimensions:(width:!t,height:!t)),favs:(user_id:!t),quality_grade:!t,reviewed_by:!t)

Get all observations of a user.
https://api.inaturalist.org/v2/observations?order_by=id&order=desc&page=1&taxon_id=3&user_id=common_snowball&locale=en-US&preferred_place_id=1&per_page=24&return_bounds=true&fields=(comments_count:!t,created_at:!t,created_at_details:all,created_time_zone:!t,faves_count:!t,geoprivacy:!t,id:!t,identifications:(current:!t),identifications_count:!t,location:!t,mappable:!t,obscured:!t,observed_on:!t,observed_on_details:all,observed_time_zone:!t,photos:(id:!t,url:!t),place_guess:!t,private_geojson:!t,quality_grade:!t,sounds:(id:!t),taxon:(iconic_taxon_id:!t,name:!t,preferred_common_name:!t,preferred_common_names:(name:!t),rank:!t,rank_level:!t),time_observed_at:!t,user:(icon_url:!t,id:!t,login:!t))

Get all species of a user.
https://api.inaturalist.org/v2/observations/species_counts?taxon_id=3&user_id=common_snowball&locale=en-US&preferred_place_id=1&per_page=50&include_ancestors=true&fields=(taxon:(name:!t,preferred_common_name:!t,rank:!t,rank_level:!t))

### OneZoom

### Wikidata
