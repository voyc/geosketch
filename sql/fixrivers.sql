-- Mississippi 1832

select st_numpoints(st_geometryN(geom,1)) from plunder.plunder where id = 1832;
            3

select st_numpoints(st_geometryN(geom,2)) from plunder.plunder where id = 1832;
            2

select st_numpoints(st_geometryN(geom,3)) from plunder.plunder where id = 1832;
            2

select st_numpoints(st_geometryN(geom,4)) from plunder.plunder where id = 1832;
          348

select st_numpoints(st_geometryN(geom,5)) from plunder.plunder where id = 1832;
            5

select st_numpoints(st_geometryN(geom,6)) from plunder.plunder where id = 1832;
            2



select st_astext(st_geometryN(geom,1)) from plunder.plunder where id = 1832;
------------
 LINESTRING(
-89.3761411203164 28.981332099297,
-89.2571302969257 29.1549132349579,
-89.0157496814026 29.2028689643313
)

select st_astext(st_geometryN(geom,2)) from plunder.plunder where id = 1832;
 LINESTRING(
-89.2609543527611 29.1551457789546,
-89.2886012436524 29.1775216740861
)

select st_astext(st_geometryN(geom,3)) from plunder.plunder where id = 1832;
 LINESTRING(
-89.2886012436524 29.1775216740861,
-89.1807783678274 29.3357032336174
)


select st_collect(array[
st_linefromtext('linestring(-89.2571302969257 29.1549132349579,-89.3761411203164 28.981332099297)'),
st_linefromtext('linestring(-89.2571302969257 29.1549132349579,-89.0157496814026 29.2028689643313)'),
st_linefromtext('linestring(-89.2571302969257 29.1549132349579,-89.1807783678274 29.3357032336174)'),
st_reverse(st_geometryN(geom,4)),
st_geometryN(geom,5),
st_geometryN(geom,6)
]) from plunder.plunder where id = 1832;


update plunder.plunder set geom = st_collect(array[
st_linefromtext('linestring(-89.2571302969257 29.1549132349579,-89.3761411203164 28.981332099297)'),
st_linefromtext('linestring(-89.2571302969257 29.1549132349579,-89.0157496814026 29.2028689643313)'),
st_linefromtext('linestring(-89.2571302969257 29.1549132349579,-89.1807783678274 29.3357032336174)'),
st_reverse(st_geometryN(geom,4)),
st_geometryN(geom,5),
st_geometryN(geom,6)
]) where id = 1832;

-- Arkansas 1665

select st_geometrytype(geom) from plunder.plunder where id = 1665;
  ST_MultiLineString
select st_numgeometries(geom) from plunder.plunder where id = 1665;
  1
select st_numpoints(st_geometryN(geom,1)) from plunder.plunder where id = 1665;
  156
select st_numpoints(geom) from plunder.plunder where id = 1665;
  (blank)
select st_astext(st_reverse(st_geometryN(geom,1))) from plunder.plunder where id = 1665;

update plunder.plunder
set geom = st_reverse(st_geometryN(geom,1))
where id = 1665;


-- Amazonas  1656

select name, st_geometrytype(geom),st_numgeometries(geom), st_numpoints(st_geometryN(geom,1)) 
from plunder.plunder where id = 1656;
  ST_MultiLineString, 1, 216

update plunder.plunder 
set geom = st_reverse(st_geometryN(geom,1))
where id = 1656;



-- Victoria Nile  1971
select name, st_geometrytype(geom),st_numgeometries(geom), st_numpoints(st_geometryN(geom,1)) 
from plunder.plunder where id = 1971;
  ST_MultiLineString; 3; 4,2,17

update plunder.plunder set geom = st_collect(array[
st_reverse(st_geometryN(geom,1)),
st_reverse(st_geometryN(geom,2)),
st_reverse(st_geometryN(geom,3))
]) where id = 1971;

-- Albert Nile  1652
select name, st_geometrytype(geom),st_numgeometries(geom), st_npoints(geom) 
from plunder.plunder where id = 1652;
  ST_MultiLineString;  1;  18

update plunder.plunder 
set geom = st_reverse(st_geometryN(geom,1))
where id = 1652;

-- Lena  1806

 ST_MultiLineString;  2;  310; 175, 135

update plunder.plunder set geom = st_collect(array[
st_reverse(st_geometryN(geom,1)),
st_reverse(st_geometryN(geom,2))
]) where id = 1806;

-- Indigirka  1765

 ST_MultiLineString;  2;  186; 184, 2 

update plunder.plunder set geom = st_collect(array[
st_geometryN(geom,1),
st_reverse(st_geometryN(geom,2))
]) where id = 1765;


-- Olenyok  1863

OlenÃ«k

update plunder.plunder set name = 'Olenyok'
where id = 1863;

-- Vilyuy  1972

 ST_MultiLineStrig;  2;  235; 142, 93 

update plunder.plunder set geom = st_collect(array[
st_reverse(st_geometryN(geom,1)),
st_geometryN(geom,2)
]) where id = 1972;

-- Kheta 1789
 1789 | Kheta | ST_MultiLineString |                2 |         50 |         42 |          8

update plunder.plunder set geom = st_collect(array[
st_geometryN(geom,1),
st_reverse(st_geometryN(geom,2))
]) where id = 1789;

-- Khatanga 1788
 1788 | Khatanga | ST_MultiLineString |                1 |         14 |         14 |           

update plunder.plunder set geom = st_collect(array[
st_reverse(st_geometryN(geom,1)),

]) where id = 1788;


update plunder.plunder set geom = st_collect(array[
st_reverse(st_geometryN(geom,1)),
ST_GeomFromText('linestring(
105.11560984077407 72.78275475167591,
105.77375353337781 73.01434941344006,
106.05631572927547 73.19984998045823,
106.47976542164594 73.37986078413837,
107.15897833175535 73.49992334669902,
107.50995657440802 73.70128844238971,
108.01449490347727 73.84650864141969,
108.64286212481487 73.94573764406685,
109.2697866650739  74.08311442582813
)')
])
where id = 1788;

-- Yenisey 1993
 1993 | Yenisey | ST_MultiLineString |                1 |        180 |        180 

update plunder.plunder set geom = st_collect(array[
st_reverse(st_geometryN(geom,1)),
ST_geomFromText('linestring(
83.16666424369039 70.11419237412868,
82.78678980798432 70.34500826651696,
82.42743019854002 70.57389966196914,
82.03686063133688 70.82238393583728,
81.64852112690413 71.01110633247698,
82.20799305227709 71.15800128422163,
82.06808240921092 71.46545202799848,
81.51913263506975 71.77586119640392
)')
])
where id = 1993;


-- Verkhniy Yenisey  1970
 1970 | Verkhniy Yenisey | ST_MultiLineString |                2 |         84 |         43 |         41

update plunder.plunder set geom = st_collect(array[
st_geometryN(geom,1),
ST_geomFromText('linestring(
91.50811729539225 53.75764390279559,
91.58288929856879 53.96245898889174,
91.87613554138429 54.091954668951004,
91.73682978323976 54.304014223671146,
91.51471647005202 54.45664428952618,
91.55681618232367 54.670734043523076,
91.6119509467017  55.001451618372826,
91.75682312762547 55.22636587003677,
91.9899518020205  55.41308475381509,
92.36446641236867 55.50318200468067
)'),
st_reverse(st_geometryN(geom,2))
])
where id = 1970;

-- Lower Tunguska  1811
 1811 | Lower Tunguska | ST_MultiLineString |                2 |        269 |        239 |         30

update plunder.plunder set geom = st_collect(array[
st_geometryN(geom,1),
st_reverse(st_geometryN(geom,2))
])
where id = 1811;


-- Verkhniy Yenisey  1970  -- recover and redo

update plunder.plunder set geom = 
'01050000000200000001020000002B00000090863691BE9D57404051908EE9DD4940747069447E845740C866863755CD4940BCFF3FE85D695740C033718973C8494020B292203D31574058CB7FFD61CA4940C829E458611657400084C3C1BED9494090C3EA12B409574050AB0E40DBE54940D0F66C6141025740709FF5F4D6F349406C3788C961045740788EA8D989014A4060853C4B15105740706EA43CF20E4A4028BEE7751A185740504F20515E1B4A4058F38749711C574070E81BB4CA264A401C4770FE091C574078DF3E5655304A405C8C21E3E2165740E8180886FC374A4024B7739B1614574078F7B44DFE3F4A40D4662500A6135740E02ACAFB58484A4010AE92200A0B574018293FD65C4C4A40342C7AD543FA564098D6922B084C4A40C420DD1E33F15640180AC65ECF4E4A40C08BBBFCD7EF564048025621B4544A40A4F12163FBEA564020495621B0564A406C5210529DE25640501D4410C5544A405CA41A2920DC564050E033FF52564A4040F03FE883D75640D837278B565B4A40E0E7CF2A33D856402850EC1DFB654A40B8D246A22FDE5640B044046942764A402822E8750BE0564060CBB2B07D814A4094F0B0A5C6DD564010B77843AB874A405884250014DD5640C8D99A65FE8C4A4028B9C5D3F1DD564060069A6575914A4034B2025E6BE25640805A821A87944A40B066DD9E80EA564010A9D4D231964A40F0545FED6EF25640E859157A629D4A4010470A9834FA5640502EC75E17AA4A40F4719CF71BFD5640E0D51797F3B24A4008C4170C25FB564050008C71F5B74A4060B909983CF65640F0E174A642BD4A403049739B62EE564078B94FE7DCC24A40BC2F105291E85640F0557426EBC84A401C37620AC7E45640403CA43C6ECF4A408808A7CEC4E35640B066181770D44A40E4765FED88E55640B03E11DDEFD74A403C70EB12FEE4564070E73062CBDA4A4064B4BE19B3E0564050C3528422DE4A40010200000029000000B82F5179E03F574018507FFDCF0C4D407451E4D84E3F574028B8A11F3B064D401CD05EEDCE415740C034AF93B2034D40A09B2FD733475740283D1F5103034D40248ACF2A4B4B574018BBCAFB63FD4C4090567E72174E5740E0BDF357D0F24C40A870FFC08A535740882B86B780D14C404C6E438586535740E81E2928FCC14C40FCA8C8F0C6505740300BDC8CA3B54C40B82547A2C452574000A90B238AAA4C40FC4DFFC07E595740F88E77C3B0A04C4028BAFB23FB5C5740703697C864974C4078613DCB395D5740E883E980A48E4C40A82F7738025C574040E7932B07884C4080B2694455595740C02119178B834C401CC1BE998158574018E38854237F4C402C03B8DF3E5D574048F99C02316E4C403C73DD9E9260574068B901CC57694C4044A9CC8D1A6557402835C0249E664C4074C151790B6A574070AB0606EA5C4C40942769C4686F5740A80AD76F3B4C4C40FCB547A20B6F574000D27A60753D4C4028B469C4F5685740505934FF96304C4080E0B7DF3263574018B748AD92284C40343233F4C25D5740B8D9B96A68254C406857BE19BD5A5740306EDB0C8E214C40803E5B50215A574058CCEFBA021D4C4028BE739B11565740108D41F3F8184C400C1585AC8F4E5740A07153046F154C402C0DC2B65A4A5740B814CAFBC0104C40B89D2BBA72495740B064A7D9EE0A4C405CAF69C4D03B57407885AB7678044C40C81DFC2373215740281F94AB5EFD4B4040DE9C772F13574068FB22EE1DF64B4090F94ABF05115740F8441BB4B3EE4B407CCA40684B135740986948AD14E84B40F086FC23021A5740180FAC763DE24B401873E03B151E57405045D76F9EDB4B404CB36C61861F574018E9CD9837D44B40D45A3DCBB71E5740683A18177CCC4B403CB4D901241A5740B8EAC55E66C04B40'
where id=1970;

-- Amur 1659, forms border between eastern Russia and China
1659 | Amur | ST_MultiLineString |                3 |        147 |         99 |         21 |         27

update plunder.plunder set geom = st_collect(array[
st_reverse(st_geometryN(geom,1)),
st_reverse(st_geometryN(geom,2)),
st_geometryN(geom,3)
]) where id = 1659;

-- Songhua 1922
 1922 | Songhua | ST_MultiLineString |                2 |         76 |         60 |         16 |

update plunder.plunder set geom = st_collect(array[
st_geometryN(geom,1),
st_reverse(st_geometryN(geom,2))
]) where id = 1922;

-- Heilong Jiang  1757
 1757 | Heilong Jiang | ST_MultiLineString |                1 |         87 |         87 |            | 

update plunder.plunder set geom = st_collect(array[
st_reverse(st_geometryN(geom,1))
]) where id = 1757;

-- Arguna 1664
1664 | Argunâ\u0080\u0099 | ST_MultiLineString |                1 |         45 |         45 |  

update plunder.plunder set name='Argun', geom=st_collect(array[
st_reverse(st_geometryN(geom,1))
]) where id = 1664;

-- Hailar 1754
 1754 | Hailar | ST_MultiLineString |                1 |         24 |         24 |            |  

update plunder.plunder set geom=st_collect(array[
st_reverse(st_geometryN(geom,1))
]) where id = 1754;

-- Hong 1760
 1760 | Hong | ST_MultiLineString |                1 |         54 |         54 |            |  

update plunder.plunder set geom=st_collect(array[
st_reverse(st_geometryN(geom,1))
]) where id = 1760;


-- Irrawaddy Delta  1770

1770 | Irrawaddy Delta | ST_MultiLineString | 4 |  72 :  26 |    6 | 11  | 29

select st_astext(st_geometryn(geom,4))
from plunder.plunder where id = 1770;

update plunder.plunder set geom = st_collect(array[
st_reverse(st_geomfromtext('LINESTRING(
94.7032947118815 16.5119381777048,
94.7283061053425 16.6732461610815,
94.7443257990964 16.7829293888802,
94.7422587424471 16.9080897080736,
94.7951754092178 17.0351620551847,
94.9030757994087 17.1641464302136,
94.9539254086308 17.2572673609999,
94.9477242368841 17.3145248475437,
94.977231479749  17.3524811877567,
95.0424471372257 17.3711105414184,
95.1201684918825 17.4723705102909,
95.2103438659767 17.6562352568517,
95.3043949727498 17.7662543805353,
95.4548767437668 17.8560938587447)')),
st_geomfromtext('linestring(
95.4548767437668 17.8560938587447,
95.4820585466646 17.8797875025912,
95.5200924012434 17.9075635846917,
95.574972771876  17.9041529400062,
95.6330570825184 17.8098176132923,
95.6942419776852 17.6245317652288,
95.7830220886985 17.4383157411785,
95.8993974137597 17.251092027675,
95.955569695585  17.1298332786829,
95.9515389341746 17.0744878200569,
96.0419210147431 16.9692746041397,
96.0896183616981 16.8466722680108,
96.189095493862  16.768330796629)'),
st_geometryN(geom,2),
st_geometryN(geom,3),
st_geometryN(geom,4)
])
where id=1770;

update plunder.plunder set geom = 
'01050000000400000001020000001A000000C4BED2C702AD5740E0D062610E83304018FB35919CAE5740B00044DC59AC30400C2CAD08A3AF57406051780F6EC83040BCFECF2A81AF5740B0022E9178E83040244B6627E4B2574020146561000931403C1170FECBB95740D0851D80052A31402039281D0DBD5740B0D21546DC413140CCC28E83A7BC5740D0FA4DB3845031403489E7F58ABE5740C0DE05353C5A31405C8C3274B7C25740C097B619015F314044A92FD7B0C75740504B1546ED78314030521E4676CD574000A9A608FFA73140C0410D357BD35740D0D0403F29C431401C8C58B31CDD5740609D95F728DB3140A42B170CDADE5740100FF7C039E13140448FA33149E15740A04A4B1656E8314010D3985ACCE45740B0E82B9176E73140BC7ADA0184E85740B0D0043550CF3140C46AE7756EEC574090F85250E19F31405CC0AD081DF2574010AFDD75357031401C8D2BBA8FF9574080262F914740314088E5CB0D28FD574020E0F5C03C213140A0C98E03E6FC574040183FA2111331408CD57AD5AE025840A09F656122F830405427A74EBC05584060898583BFD83040547DFC231A0C58400008BC53B1C4304001020000000600000038E821E3CFDE5740A03FFA5D5CD03040E81292A0B3D45740C0544D1605543040607869C427CF574090BA2BF40B2230405CFFA2317BC85740F0E88F5A5D063040C8E4D2C74FC65740604DB84E66EA2F401C2C22E303C55740A00AF758A3AD2F4001020000000B000000C437035E5FE6574080F7D001D8E6304094E1CF2A8CE95740306EF1237BC430408C36D664FCED5740105C73D59AB53040FCEFB7DF0CF55740604FE5AF43A73040687FB4C2CAF7574010D36261E4973040CCE4CB0D36F6574020E7EBE97C873040A825A7CE1BF65740A093A16B627A30407C26C5537AF7574080D883E6947030405C82FFC03AFA5740D0231AE38C69304020230D35A2FF574060B3C38DED633040B4BAEA12BE025840609F45DC0557304001020000001D0000006473F5693DDE5740B052154661BE3140D0EF025EF8D95740007CBAB6CAB7314030DA392EC8D65740008A2D9171AA31400471170CF2D2574000ACF85DDE8D314008D7EEAF9BD25740004661C492803140D46E5B50AAD45740B0734D16B9773140F87088C9BBD557406064B419626E31403C8651F972D55740B0453B05F8603140389A3CCB49D4574040FDBA5306593140F88F5FEDACD157404093AB42A4523140640AB1A5DCD05740A0BC1F1D3B4D314054A9E03B2ED0574030A329F458393140C852AD08E2CF5740C0C5E94CB12D3140D85B6C61A7CD5740B0F7BA53EF24314068862F57E8CB5740401BE84CE51331404078F886A1CA5740E07B74728CFA3040A083E4D834CB574080A860C447E7304020BAF14CA2CD574000A1AC4217DA3040942C628A30CE574000F80C6FD4CB30400CC7D9013FCB5740704E780FA6AC3040084FD3C749C957405094F8C0489C3040B449CC8DD5C657406061D001019330405C7847A2E0C35740C0F10C6FCB903040ECDC4068EDC05740E0389894DF8030406414BB7CF8BD574060B9770F3A633040842F694412BA574060ADB8B6AC4930400C6A7D72CCB25740801BAD427B2930406C3A739BDCAF5740F03C3C0596143040A4A79C77FFA95740E029BCEB42FA2F40'
where id = 1770;


-- Indus 1769

1769 | Indus | ST_MultiLineString          8  235:    2,   4,   6,  5,   2,   2,  66, 148


select  
st_astext(st_geometryn(geom,1)), 
st_astext(st_geometryn(geom,2)), 
st_astext(st_geometryn(geom,3)), 
st_astext(st_geometryn(geom,4)), 
st_astext(st_geometryn(geom,5)), 
st_astext(st_geometryn(geom,6))
from plunder.plunder where id = 1769;

update plunder.plunder set geom=st_collect(array[
st_reverse(st_geomFromText('LINESTRING(67.8599719583393 23.9026756863339,67.9251876158159 24.0007575545176)')),
st_reverse(st_geomFromText('LINESTRING(67.6458248225576 23.919883938493,67.7111955096651 23.956625881879,67.7138310079947 24.0008609073051,67.7134175959454 24.0663866240435)')),
st_geomFromText('LINESTRING(67.9251876158159 24.0007575545176,67.9995500017312 24.0071137558951,68.0166032242594 23.990680650092,68.0245097183489 23.9336815450673,68.0424414409198 23.8916686059215,68.0370154155291 23.8482604027954)'),
st_reverse(st_geomFromText('LINESTRING(67.9251876158159 24.0007575545176,67.9241540870415 24.055947984412,67.8007507670343 24.0585059674765,67.7601330909694 24.052847398089,67.7134175959454 24.0663866240435)')),
st_reverse(st_geomFromText('LINESTRING(67.7134175959454 24.0663866240435,67.660759311593 24.1048597272946)')),
st_geometryn(geom,7),
st_geometryn(geom,8)
]) where id = 1769;

-- Ganges 1748

1748 | Ganges | ST_MultiLineString,12,323: 4 , 10 ,  8 , 14 , 14 , 23 ,  7 , 33 , 11 , 22 ,  9 ,168

select id, name, st_geometrytype(geom), st_numgeometries(geom), st_npoints(geom), 
st_npoints( st_geometryn(geom, 1)), 
st_npoints( st_geometryn(geom, 2)), 
st_npoints( st_geometryn(geom, 3)), 
st_npoints( st_geometryn(geom, 4)), 
st_npoints( st_geometryn(geom, 5)), 
st_npoints( st_geometryn(geom, 6)), 
st_npoints( st_geometryn(geom, 7)), 
st_npoints( st_geometryn(geom, 8)),
st_npoints( st_geometryn(geom, 9)),
st_npoints( st_geometryn(geom,10)),
st_npoints( st_geometryn(geom,11)),
st_npoints( st_geometryn(geom,12))
from plunder.plunder where id = 1748;

select st_astext(geom) from plunder.plunder where id = 1748;

update plunder.plunder set geom=st_collect(array[
st_reverse(st_geometryN(geom,1)),
st_geometryn(geom, 2),
st_geometryn(geom, 3),
st_geometryn(geom, 4),
st_geometryn(geom, 5),
st_geometryn(geom, 6),
st_geometryn(geom, 7),
st_geometryn(geom, 8),
st_geometryn(geom, 9),
st_geometryn(geom,10),
st_geometryn(geom,11),
st_geometryn(geom,12)
]) where id = 1748;

MULTILINESTRING (
(89.4831482276087 22.2755398626746,89.4252706234406 22.495526434997,89.3721472510948 22.5811801212656,89.2996968930972 22.6188522406384),
(89.2996968930972 22.6188522406384,89.260784539375 22.5735578480163,89.2554618676711 22.4453486193433,89.2864677264045 22.3075792501823,89.3537504414298 22.1603014182759,89.3785551293158 22.0580854358942,89.3522001487179 21.9723025575171,89.3505465023193 21.8856411808958,89.3358187197582 21.7883861350122,89.3537504414298 21.7211034208862),
(88.439749383927 22.9864783800732,88.385024042026 22.8679584821982,88.3466801290847 22.7352534041214,88.3437862483368 22.6292650418483,88.290042759266 22.549399115277,88.1853463072863 22.4956039493628,88.1175468283236 22.410234483035,88.0870577335276 22.2177139344506),
(88.439749383927 22.9864783800732,88.5184525896154 22.9753421084516,88.597930942559 22.9747736676707,88.682163527325 22.9537930365195,88.7562675317213 22.9149840355848,88.8204496604235 22.8583725041877,88.84261884998 22.8028461775091,88.8228784522788 22.7483275411831,88.8452543474103 22.7002426214999,88.9096431825869 22.6585397407165,88.9714481953779 22.5109260120259,89.0499446963907 22.2746355251094,89.0558358088755 22.1862429877237,89.0514433122591 22.0931737328815),
(90.0743782896264 23.5734192973628,90.0960307152454 23.3403069120344,90.1272432795538 23.2519402121711,90.1808834167364 23.2059223491372,90.2284257340604 23.1784821638208,90.2436186055143 23.1382520613836,90.2652193542899 23.1155919463113,90.2987573585653 23.0880742457299,90.3021163273067 23.0545104030327,90.3152421403126 23.0155980493106,90.3616475769742 22.9610535754622,90.3613375186117 22.8758649762877,90.3943070821062 22.7748375514119,90.4350281109586 22.7519190539213),
(89.1093725932706 23.9919208844413,89.2185648946542 23.8084695499298,89.3017639506459 23.7325051944592,89.3812423035895 23.6937995472114,89.4471814314779 23.6401852484505,89.4995813334119 23.5716622990759,89.5200452006256 23.5247659368985,89.5086763859065 23.499444485075,89.5268664899966 23.4833731144777,89.5747188656832 23.4765518251067,89.598334995164 23.443091335197,89.5978182312264 23.3830433215921,89.6150264833856 23.3369737817147,89.6324931170637 23.3010844999498,89.6375574072486 23.2524828154296,89.6597265968051 23.2229238957212,89.7094910013087 23.1923314481378,89.7186377297475 23.1333944767737,89.7653532247716 23.0200680611921,89.9262736345207 22.8401824000977,90.0075606625946 22.6852306180986,90.0135551287663 22.5634809435907,89.985133091519 22.466380927338),
(89.1093725932706 23.9919208844413,89.1997546729399 23.9326480171923,89.2808866722822 23.9307876652186,89.3799503923967 23.9011253927227,89.4970491878698 23.8435578478165,89.6040194029731 23.8230939806028,89.7492818541743 23.8480536972204),
(88.3969612975259 24.3892609723161,88.5101326843759 24.2613876413266,88.5337488138567 24.2084709745559,88.5269275244857 24.1655536969456,88.5542126810705 24.128863430403,88.6157076354991 24.0984776883947,88.6429927920838 24.0593586290975,88.6361715027127 24.0115837668774,88.6902250510453 23.9677621526013,88.8052567889697 23.9279196228923,88.8644263043306 23.8559085144664,88.8678369490161 23.7517288273236,88.8371928245892 23.6657909202149,88.7723905782626 23.5980947940396,88.7637089378173 23.5306570502827,88.8110445495664 23.4634776880449,88.8527991071931 23.4407142192858,88.8846834659693 23.4234542911826,88.9055090674895 23.3899421253288,88.9259729347032 23.3634837919435,88.9889148290562 23.3327879906733,89.0017305845989 23.2633607037336,89.0275171244158 23.1860785995478,89.088753696426 23.1125947127758,89.1129382666877 23.0404802515624,89.0998124527825 22.9696835390641,89.1134550315246 22.8925564645093,89.1538660011151 22.8091248645209,89.2084363142845 22.7487409532325,89.2684326519454 22.7075031604426,89.2755123228355 22.7026714133551,89.2708614438006 22.6789519310868,89.2996968930972 22.6188522406384),
(88.3969612975259 24.3892609723161,88.4985571631826 24.3466279155459,88.6423209985153 24.3259573427572,88.7235046729024 24.2749010279601,88.7422115418292 24.1934072943112,88.7697550799331 24.1442888449543,88.8062386409006 24.1274940048445,88.8582768085279 24.1310855166833,88.9259729347032 24.15506338137,89.0096370786883 24.1086837831301,89.1093725932706 23.9919208844413),
(87.919832798345 24.8250483259196,87.9401933127712 24.6660141056665,88.0188448425155 24.5425332703942,88.1745976092923 24.3887958843226,88.2380562684821 24.2342575143728,88.2090141136105 24.0789698346902,88.20539676335 23.9446886254797,88.2269975121255 23.8314138858422,88.2154219909322 23.7396365421927,88.1833826025252 23.7001040717456,88.2137166685894 23.6367487653433,88.271852655176 23.5873460960456,88.3037886898962 23.5426718201484,88.3446130715361 23.5303211534985,88.3607361189768 23.4605579697745,88.3521578304196 23.3333564314542,88.3752055191194 23.2554283712224,88.4299825378639 23.2267737899785,88.4668795108808 23.1861302763912,88.4860514669018 23.133523667983,88.4587146343729 23.0274836288664,88.439749383927 22.9864783800732),
(87.919832798345 24.8250483259196,87.9462911317304 24.7531664087028,87.9993628272327 24.6614407418968,88.0790478857514 24.5499230005461,88.1454521016332 24.4857925477879,88.2250338073644 24.4606261255953,88.287148878518 24.4797464056721,88.337533400646 24.4538565130676,88.3969612975259 24.3892609723161),


-- Bratul Chillia 1681
 1681 | Bratul Chillia | ST_MultiLineString |                1 |         16 |         16 


update plunder.plunder set geom=st_collect(array[
st_reverse(st_geometryN(geom,1))
]) where id = 1681;

update plunder.plunder set geom=
st_geomfromtext('MULTILINESTRING((
28.7607047869964 45.234138495695 ,
28.7809619486351 45.2180671250978,
28.8830745782292 45.1800332705191
),(
28.7607047869964 45.234138495695 ,
28.7883000019436 45.2409597841668,
28.7913489114232 45.2519151877358,
28.7698515154352 45.2669013536146,
28.7666475763247 45.2862283392665,
28.781737094991  45.3098444687473,
28.8243184749177 45.3110847030966,
28.8942883642167 45.2899490423145,
29.0274068543429 45.3205414898979,
29.2235705907103 45.4029137235895,
29.4036629573797 45.4196568877552,
29.5676839534518 45.3708226592384,
29.6519682150611 45.3139010685795,
29.7059184097069 45.2598991970903
))')
where id = 1681;

-- Loire 2006
select id, name, st_geometrytype(geom),st_numgeometries(geom), st_npoints(geom),
st_npoints(st_geometryN(geom,1)), st_npoints(st_geometryN(geom,2)), st_npoints(st_geometryN(geom,3))
from plunder.plunder where id = 2006;
 2006 | Loire | ST_MultiLineString |                2 |         63 |         32 |         31 |

select st_astext(geom)
from plunder.plunder where id = 2006;

MULTILINESTRING((3.08325402205554 46.9854269472958,3.02186242041444 47.1492670762146,2.91592573408542 47
.2872431500514,2.89287804538554 47.3632591823654,2.91747602679726 47.4234105496572,2.8827494641165 47.498
8064643469,2.78859500455587 47.5895502792221,2.61434207532659 47.6911461448788,2.35988732274183 47.803594
0622162,2.1453784517542 47.8712643499698,1.9708154641624 47.8941828474605,1.84519005697558 47.89252920196
12,1.76850223109312 47.8662775741508,1.60820193806904 47.7643716501316,1.36439253069079 47.5868889433701,
1.15820356584192 47.4737433949418,0.989738397209294 47.4250125192124,0.815433791136627 47.39581533471,0.6
35289747623801 47.3862551951212,0.427757195638094 47.3406249048156,0.20740888810974 47.2440416533996,0.07
5401442022951 47.2181775983175,-0.038312547186251 47.2490284283194,-0.21636369472867 47.3642410342964,-0.
418030971751875 47.4024299176066,-0.731241827648205 47.3709589708799,-1.0563899399437 47.3746021595621,-1
.24870378295316 47.3364132753524,-1.41657467328253 47.2575808784548,-1.55904659652316 47.2163172472432,-1
.63253048329511 47.2016153022045,-1.74252376945634 47.2159555120373),

(3.08313242955335 46.985029621842,3.
16822812934155 46.9768905229167,3.24855723812597 46.9515885340897,3.32888634691038 46.846034756578,3.4895
4456447921 46.8291268679192,3.6254861331913 46.740273160756,3.72435272861827 46.6385464686356,3.749069377
47501 46.5578769492954,3.86029429733035 46.5068658965721,3.98387754161407 46.4600636733711,3.990056703828
25 46.3791286287526,4.03949000154174 46.2382716709134,4.1012816236836 46.1655675224932,4.1012816236836 46
.0627625702672,4.03331083932755 45.9769452703039,4.05184832597011 45.9253909537976,4.15689408361127 45.85
22735802014,4.21250654353894 45.7445731756423,4.21868570575313 45.6280229101562,4.25576067903824 45.47657
77937291,4.20014821911057 45.3681528467971,4.13217743475452 45.3073439208279,4.08274413704104 45.23776804
16952,3.95298173054314 45.1985941259624,3.90972759504384 45.115805007537,3.92208591947221 45.037262256135
,3.90354843282965 44.9717274961322,3.9282650816864 44.8710952554458,4.07038581261267 44.8097545497225,4.1
6925240803964 44.7746733967699,4.20014821911057 44.8229044843909))

update plunder.plunder set geom = st_collect(array[
st_geometryn(geom,1),
st_reverse(st_geometryn(geom,2))
])
where id = 2006;

-- Pend Oreille 1880

 1880 | Pend Oreille | ST_MultiLineString |                1 |         18 |         18 |            |

update plunder.plunder set geom = st_collect(array[
st_reverse(st_geometryn(geom,1))
])
where id = 1880;

-- Rupert 1896

 1896 | Rupert | ST_MultiLineString | 3 |         33 |         17 |          8 |         8

MULTILINESTRING((-74.8181408353312 51.4121593285902,-74.589627651295 51.479545396403,-74.490512254337 51
.490294094397,-74.4446235825123 51.4668846704912,-74.3893297998304 51.4618203803063,-74.336878221053 51.4
600633811202,-74.2974491033934 51.4348969589275,-74.2557462226101 51.4049763049126,-74.1690331691454 51.3
764509139785,-74.072553270517 51.3706114774378,-73.966409878613 51.387457994391,-73.8910914782891 51.3494
49978234,-73.8466497463887 51.2565874289667,-73.8365470035413 51.1745510929586,-73.8608349274899 51.10334
09693104,-73.815075445975 51.0702163761849,-73.6414426334707 51.0776061063368),

(-75.2037503732811 51.4463
432889117,-75.2291751778921 51.4851264514247,-75.2257903716283 51.5078124049186,-75.2417067125947 51.5269
843609395,-75.3267402821382 51.5397484405382,-75.4809169177815 51.5461563178598,-75.8218005029908 51.4995
441756233,-76.5534871084433 51.3639968936418),

(-78.7313645083653 51.4974771189739,-78.6899975243662 51.48
72968617608,-78.4570660061912 51.3966563987738,-78.1572651841409 51.3623949240865,-77.712951219723 51.354
1783716346,-77.3041389634424 51.3784921331055,-76.9308284161984 51.4352845325552,-76.8206025869398 51.415
2857533349))


update plunder.plunder set geom = st_collect(array[
st_reverse(st_geometryn(geom,1)),
st_geometryn(geom,2),
st_reverse(st_geometryn(geom,3))
])
where id = 1896;

-- Niagara 1838
1838 | Niagara | ST_MultiLineString |                1 |          2 |          2 |            |


-- St Lawrence 1927
1927 | Saint Lawrence | ST_MultiLineString |                1 |          7 |          7 | 

-- Donau  1725
select id, name, st_geometrytype(geom),st_numgeometries(geom), st_npoints(geom),
st_npoints(st_geometryN(geom,1)), st_npoints(st_geometryN(geom,2)), st_npoints(st_geometryN(geom,3))
from plunder.plunder where id = 1725;

 1725 | Donau | ST_MultiLineString |                2 |         68 |         29 |         39 |

update plunder.plunder set geom = st_collect(array[
st_geometryn(geom,1),
st_reverse(st_geometryn(geom,2))
])
where id = 1725;

-- Dniper 1723

 1723 | Dnipro | ST_MultiLineString |                5 |        103 |          8 |         20 |

 MULTILINESTRING (
(32.5779911637612 46.6156045600025,32.6454805843615 46.6496076522714,32.9336800476961 46
.717277940025,33.0666435072921 46.7587482777109,33.2369690287977 46.7774551457384,33.3569100281753 46.785
8784046647,33.451271193311 46.8087969021553,33.5398962746934 46.8312503116526),
(35.1052787615057 47.84012
92991279,35.1299284197608 47.9719817164831,35.1176294290549 48.0375849475873,35.0765983418401 48.08088979
79259,35.0871920102032 48.1083299832422,35.1494104350436 48.1199571803796,35.1849121440802 48.15003286402
55,35.1936971373131 48.1986087101239,35.1695642429955 48.2798440622537,35.1126168148142 48.3937130801946,
34.9588277527986 48.4770671658171,34.8185779149389 48.4921566835841,34.7081970560494 48.5299063173227,34.
4101273947635 48.6401838243241,34.2253841490593 48.7364053414334,34.0646187680418 48.8078221706567,33.717
3531430332 48.9422067326547,33.5075985047673 49.0080683461773,33.3630595230786 49.0654033470868,33.193974
2368216 49.0939028995992),
(31.8880074399914 49.5544432642453,31.6906551452188 49.6361437034692,31.4624003
43601 49.7567048204712),
(31.4398694188387 50.0001008166994,31.2443257991963 49.9789134790739,31.071209751
5288 50.0232001813433,30.8555123230353 50.1257778998303,30.7066841975177 50.2219994169396,30.624828728663
 50.3118130558279,30.5665893901883 50.4166645374385,30.5146545753484 50.596601874477),
(33.3906547380258 5
4.917216702289,33.1092765640622 54.9857913276077,32.9779150731222 55.0011392277932,32.9027775408509 54.98
61530628136,32.8228340999138 54.957886054298,32.7380847512104 54.9162865263022,32.6870284364132 54.870966
2952584,32.6697685074108 54.8219253611666,32.6112707865177 54.762936712959,32.5115352719353 54.6940520292
778,32.3816207209196 54.6948530140554,32.221423780683 54.7653913441353,32.0055713234578 54.7771218940602,
31.5983093607884 54.7066869167679,30.9737480000702 54.6551396755556,30.7176396010868 54.6134109563506,30.
6217281432393 54.5643700222588,30.5521199891462 54.5442162134076,30.5088151388077 54.5530012066404,30.462
564731777 54.5365939401582,30.4132654152668 54.4949685737407,30.3602453957085 54.4247919788668,30.3035046
731022 54.3260383162154,30.3183874852942 54.1847032745366,30.4048938331839 54.0008385279758,30.4066508314
708 53.8990101183223,30.3235551282666 53.8792438830988,30.2751343117991 53.8015483668637,30.2613883802696
 53.6659752464605,30.2836609226135 53.5228315296514,30.3712007992775 53.2965921087389,30.279010044478 53.
2504967313391,30.2603031755511 53.2059774850729,30.2841776874504 53.1476347929114,30.2514665054749 53.120
1687691734,30.1620662777366 53.1235794138589,30.0908044772449 53.1006092395248,30.0375777521116 53.051232
4086488,30.034270461113 52.9540032011868,30.0808826024502 52.8088441027732,30.1434110856532 52.7101679553
869,30.2220626153974 52.6579230821845,30.2580810892709 52.6062208113414,30.2515698582624 52.5550094669134
,30.279423455628 52.5070795759617,30.3415385267816 52.4623794625422,30.3654647155242 52.4298233101977,30.
3510986672698 52.4093077661406,30.3969873390945 52.3799555529065,30.5031307309985 52.3417925071186,30.545
8154637128 52.3057998725661,30.5250415381365 52.2719518090288,30.5839009942355 52.1966075711825,30.722290
4801216 52.0797671572286,30.7961877780436 51.9956896020935,30.8053861833258 51.9443232289339,30.772933383
7687 51.8938870308618,30.6986226746967 51.8443810087766,30.624828728663 51.765729478133,30.551344841891 5
1.6578807647855,30.5472624045364 51.5449160835105,30.612478062013 51.4267837592631,30.6107210628268 51.33
01229925821,30.5076265804024 51.217313340938))

update plunder.plunder set geom = st_collect(array[
st_reverse(st_geometryn(geom,1)),
st_reverse(st_geometryn(geom,2)),
st_reverse(st_geometryn(geom,3)),
st_reverse(st_geometryn(geom,4)),
st_geometryn(geom,5)
])
where id = 1723;




