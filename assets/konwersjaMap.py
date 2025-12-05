import geopandas as gpd

# 1. Wczytaj GeoJSON
gdf = gpd.read_file("map_org.geojson")

# 2. Ustaw układ współrzędnych, jeśli GeoJSON nie jest poprawnie rozpoznany
# (w Twoim pliku jest "crs" w środku, ale czasem geopandas go ignoruje)
gdf = gdf.set_crs(epsg=2178, allow_override=True)

# 3. Przelicz na WGS84 (EPSG:4326)
gdf_wgs = gdf.to_crs(epsg=4326)

# 4. Zapisz wynik do nowego pliku GeoJSON
gdf_wgs.to_file("strefy.geojson", driver="GeoJSON")
