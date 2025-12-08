import geopandas as gpd

gdf = gpd.read_file("map_org.geojson")

gdf = gdf.set_crs(epsg=2178, allow_override=True)

gdf_wgs = gdf.to_crs(epsg=4326)


gdf_wgs.to_file("strefy.json", driver="GeoJSON")
