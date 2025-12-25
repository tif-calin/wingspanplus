
This contains all preprocessing and scraping scripts for data used by the project.

### GBIF
The maps in /public/assets/range-maps are generated based on GBIF data using an incredible library called [gbif.range](https://github.com/8Ginette8/gbif.range).

```r
# input variables
sp_name="Corvus corone"

# download libraries
remotes::install_github("8Ginette8/gbif.range")
library(gbif.range)

# get eco region and map data
eco.terra <- read_bioreg(bioreg_name="eco_terra", save_dir=NULL)
countries <- rnaturalearth::ne_countries(type="countries", returnclass="sv")
bioreg <- eco.terra

# download occurrence data from GBIF
obs.species <- get_gbif(sp_name=sp_name, class=212, search=FALSE, should_use_occ_download=TRUE)
range.species <- get_range(
  occ_coord=obs.species,
  bioreg=bioreg,
  bioreg_name="ECO_NAME",
  degrees_outlier=5,
)
# plot and save
png(file_name, bg="#fff0")
terra::plot(countries, axes=FALSE, border="#c2cbcc", col="#c2cbcc", legend=FALSE, mar=c(0,0,0,0))
terra::plot(range.species$rangeOutput, col="#796e66", add=TRUE, axes=FALSE, legend=FALSE)
dev.off()
```

The data downloads from GBIF are massive so I had to contribute a PR that added an alternative download strategy using a GBIF API endpoint meant for large downloads (first-ish time working with R!). However, these downloads can still take longer than half an hour, especially for birds with many records. Since my strategy was to start with the top-most observed species on iNaturalist, I regularly saw species that took upwards of an hour to download. Which is an improvement from the >24 hours it took before I added the `rgbif::occ_download` strategy.

### Avibase
Used for regression analysis for wingspan and egg capacity.

1. For every official species, collect avibase lifehistory properties.
2. For each order that has at least 10 official species, run a regression analysis and see which properties are most predictive of [wingspan|egg capacity].
3. Derive prediction equations for each property that can be used on novel species.

### iNaturalist

#### v2 vs v1 API

iNaturalist's API is migrating to its v2 API. The main difference seems to be the addition of a `fields` query parameter that operates similar to GraphQL where you specify the specific fields you want to receive.

For example, with the old API, to find a list CC0 photos of a given taxon you would do this (this is still the enpoint currently used on the official website):
https://api.inaturalist.org/v1/observations?taxon_id=1289673&order_by=votes&quality_grade=research&photo_license=cc0&photos=true&page=&per_page=30

But the API v2 equivalent is:
https://api.inaturalist.org/v2/observations?taxon_id=1289673&order_by=votes&quality_grade=research&photo_license=cc0&photos=true&page=&per_page=30&fields=(id:!t,photos:(id:!t,license_code:!t,url:!t,original_dimensions:(width:!t,height:!t)),favs:(user_id:!t),quality_grade:!t,reviewed_by:!t)

v2 is preferred so we don't spam their servers and our cache sizes are slimmer.

#### Other endpoints of interest

Here's some addition endpoints of interest to this project:

Get all observations of a user.
https://api.inaturalist.org/v2/observations?order_by=id&order=desc&page=1&taxon_id=3&user_id=common_snowball&locale=en-US&preferred_place_id=1&per_page=24&return_bounds=true&fields=(comments_count:!t,created_at:!t,created_at_details:all,created_time_zone:!t,faves_count:!t,geoprivacy:!t,id:!t,identifications:(current:!t),identifications_count:!t,location:!t,mappable:!t,obscured:!t,observed_on:!t,observed_on_details:all,observed_time_zone:!t,photos:(id:!t,url:!t),place_guess:!t,private_geojson:!t,quality_grade:!t,sounds:(id:!t),taxon:(iconic_taxon_id:!t,name:!t,preferred_common_name:!t,preferred_common_names:(name:!t),rank:!t,rank_level:!t),time_observed_at:!t,user:(icon_url:!t,id:!t,login:!t))

Get all species of a user.
https://api.inaturalist.org/v2/observations/species_counts?taxon_id=3&user_id=common_snowball&locale=en-US&preferred_place_id=1&per_page=50&include_ancestors=true&fields=(taxon:(name:!t,preferred_common_name:!t,rank:!t,rank_level:!t))

### OneZoom
OneZoom has a really neat tool to gage the "popularity" of a species based on the number of views its corresponding Wikipedia page has. OneZoom uses OpenTreeOfLife as its backbone and uses the same identifiers. For example, here's the top 100 most "popular" bird species:

https://www.onezoom.org/popularity/list?key=0&otts=81461&expand_taxa=True&max=100&names=True&include_raw=True&sort=raw

Dodo, Bald Eagle, Peregrine Falcon, Red-Tailed Hawk, Golden Eagle, Great Horned Owl, Snowy Owl, Big Blue Darter, Emu, House Sparrow. Pretty unsurprising stuff.

The limit for any given query is 100 species, but I have a private API key (just email them. They're quite generous) that allows me to query for a little over 3,000 at once.

### Wikidata
WikiData serves as a good centralized source of identifiers for other projects. You can search by common or Latin name and get back a Wikidata ID. From that we can fetch its "claims" which includes identifiers for all of our other APIs (iNaturalist, Open Tree of Life, GBIF, Avibase, etc). Wikidata is often out of date but it's trivial to update it manually. I enjoy this process because it's a great way to improve Wikidata while benefitting from it and it counts as a contribution towards my access to [The Wikipedia Library](https://wikipedialibrary.wmflabs.org/) :)
