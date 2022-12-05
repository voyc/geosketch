select 'voyc.data.river[2] = {"type": "FeatureCollection","features":['
union all select '{"type":"Feature","geometry":' || st_asgeojson(the_geom,6) 
|| ',"properties":{gid:' || gid || ',"name":"' || name || '"}},'
from plunder.rivers50 where featurecla = 'River' and scalerank = 2
union all select ']}';