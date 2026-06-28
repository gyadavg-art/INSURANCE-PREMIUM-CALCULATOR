// ═══════════════════════════════════════════════════════════
// HEALTH CALCULATOR JS
// ═══════════════════════════════════════════════════════════

// =============================================================================
// DATA TABLES
// =============================================================================

// Yuva Bharat – Age band order: [0-17, 18-30, 31-35, 36-40, 41-45, 46-50, 51-55, 56-60, 61-65, >65]
// SI order: [5L, 10L, 15L, 25L, 50L, 75L, 1Cr]
// Zone2 missing 56-60 values for Basic estimated as Zone1 × 0.8182

const YB = {
  Basic: {
    z1: {
      annual: [
        [4279,6094,7370,9301,12238,14652,18887,21318,28870,32648],
        [5247,7486,9070,11457,15081,18062,23298,26301,35629,40299],
        [6529,9334,11314,14306,18843,22578,29134,32890,44578,50424],
        [8773,12573,15252,19294,25438,30492,39358,44446,60253,68162],
        [12194,17501,21247,26895,35486,42548,54940,62046,84145,95194],
        [13789,19800,24041,30437,40167,48164,62194,70246,95271,107789],
        [14916,21428,26026,32951,43489,52146,67348,76065,103169,116727]
      ],
      hy: [
        [2222,3162,3823,4824,6345,7596,9790,11050,14962,16920],
        [2723,3883,4704,5941,7818,9363,12076,13632,18464,20884],
        [3387,4841,5867,7417,9768,11702,15099,17045,23101,26130],
        [4550,6519,7907,10001,13184,15803,20396,23032,31222,35319],
        [6322,9072,11013,13939,18390,22049,28469,32151,43600,49325],
        [7149,10263,12460,15774,20815,24959,32228,36399,49365,55850],
        [7733,11107,13489,17077,22536,27022,34898,39414,53457,60481]
      ],
      quarterly: [
        [1135,1614,1951,2460,3236,3873,4991,5633,7627,8624],
        [1390,1981,2399,3030,3986,4773,6156,6948,9411,10644],
        [1729,2469,2992,3782,4980,5965,7696,8688,11773,13317],
        [2321,3324,4031,5099,6721,8055,10396,11739,15912,18000],
        [3224,4625,5614,7105,9373,11238,14509,16385,22219,25136],
        [3645,5232,6352,8040,10609,12720,16424,18550,25157,28461],
        [3943,5662,6876,8704,11486,13771,17785,20086,27242,30821]
      ],
      monthly: [
        [391,553,667,839,1100,1315,1693,1909,2582,2919],
        [478,677,818,1031,1354,1619,2086,2353,3185,3601],
        [592,842,1018,1285,1689,2022,2606,2940,3982,4503],
        [792,1130,1369,1729,2276,2727,3517,3970,5378,6083],
        [1096,1569,1903,2406,3172,3801,4905,5538,7507,8492],
        [1239,1774,2152,2722,3589,4301,5551,6269,8499,9614],
        [1339,1919,2329,2946,3885,4656,6011,6787,9202,10410]
      ]
    },
    z2: {
      annual: [
        [3501,4986,6030,7610,10013,11988,15453,17445,23621,26712],
        [4293,6125,7421,9374,12339,14778,19062,21519,29151,32972],
        [5342,7637,9257,11705,15417,18473,23837,26910,36473,41256],
        [7178,10287,12479,15786,20813,24948,32202,36362,49298,55769],
        [9977,14319,17384,22005,29034,34812,44951,50778,68846,77886],
        [11282,16200,19670,24903,32864,39407,50886,57474,77949,88191],
        [12204,17532,21294,26960,35582,42665,55103,62235,84411,95504]
      ],
      // Zone2 HY/Qtr/Monthly derived from z1 × 0.8182 in lookup
      hy: null,
      quarterly: null,
      monthly: null
    }
  },
  Gold: {
    z1: {
      annual: [
        [5038,7161,8465,10445,14256,16550,20895,23060,30817,34672],
        [5984,8767,10384,12832,17281,20130,25498,28230,37796,42554],
        [7310,10929,12947,16011,21401,24987,31702,35150,47130,53092],
        [9933,15092,17815,21945,29359,34161,43241,47820,64020,72083],
        [13937,21725,25526,31279,41800,48389,61067,67290,89925,101189],
        [15763,24580,28881,35398,47311,54775,69130,76180,101816,114582],
        [17050,26604,31262,38319,51227,59307,74855,82500,110253,124080]
      ],
      hy: [
        [2615,3715,4390,5416,7391,8579,10830,11950,15971,17969],
        [3105,4547,5385,6653,8958,10434,13216,14630,19587,22052],
        [3792,5667,6713,8300,11093,12951,16430,18210,24423,27512],
        [5151,7824,9235,11375,15216,17704,22408,24780,33174,37351],
        [7226,11261,13230,16210,21662,25075,31644,34860,46595,52431],
        [8172,12740,14968,18345,24517,28384,35821,39470,52756,59370],
        [8839,13788,16202,19858,26546,30732,38787,42740,57127,64291]
      ],
      quarterly: [
        [1335,1896,2240,2762,3769,4374,5521,6095,8141,9158],
        [1585,2319,2746,3393,4567,5319,6736,7458,9983,11239],
        [1935,2890,3423,4232,5655,6601,8374,9285,12447,14021],
        [2627,3989,4708,5798,7756,9023,11421,12630,16906,19035],
        [3684,5740,6744,8263,11040,12780,16127,17770,23745,26719],
        [4166,6494,7629,9350,12495,14465,18255,20110,26884,30255],
        [4506,7028,8258,10121,13529,15662,19767,21780,29112,32762]
      ],
      monthly: [
        [459,648,764,941,1280,1485,1872,2065,2756,3099],
        [543,791,935,1153,1550,1804,2282,2525,3378,3802],
        [661,984,1164,1437,1917,2236,2835,3142,4209,4740],
        [895,1355,1597,1965,2626,3054,3863,4271,5714,6433],
        [1252,1946,2284,2797,3734,4321,5451,6006,8022,9026],
        [1414,2200,2583,3164,4225,4890,6169,6798,9082,10219],
        [1529,2380,2795,3424,4574,5294,6680,7361,9834,11066]
      ]
    },
    z2: {
      annual: [
        [4122,5859,6926,8546,11664,13541,17096,18873,25214,28368],
        [4896,7173,8496,10499,14139,16470,20862,23099,30924,34817],
        [5981,8942,10593,13100,17510,20444,25938,28760,38561,43439],
        [8127,12348,14576,17955,24021,27950,35379,39128,52380,58977],
        [11403,17775,20885,25592,34200,39591,49964,55058,73575,82791],
        [12897,20111,23630,28962,38709,44816,56561,62334,83304,93749],
        [13950,21767,25578,31352,41913,48524,61245,67500,90207,101520]
      ],
      hy: [
        [2141,3041,3593,4432,6048,7020,8862,9783,13068,14702],
        [2542,3721,4407,5444,7330,8538,10814,11972,16027,18043],
        [3103,4638,5493,6792,9077,10597,13443,14905,19983,22510],
        [4216,6402,7557,9307,12450,14486,18335,20277,27143,30561],
        [5913,9214,10825,13264,17724,20517,25891,28530,38124,42899],
        [6687,10424,12247,15010,20060,23224,29309,32300,43165,48576],
        [7232,11282,13257,16248,21720,25145,31736,34977,46741,52603]
      ],
      quarterly: [
        [1093,1552,1833,2261,3084,3580,4518,4987,6661,7494],
        [1298,1899,2248,2777,3738,4353,5513,6103,8169,9197],
        [1584,2366,2802,3463,4628,5402,6853,7598,10185,11473],
        [2151,3265,3853,4745,6347,7384,9345,10335,13833,15575],
        [3015,4698,5519,6761,9034,10457,13195,14540,19429,21862],
        [3410,5314,6243,7651,10224,11836,14937,16461,21997,24755],
        [3688,5751,6758,8282,11070,12815,16174,17825,23820,26806]
      ],
      monthly: [
        [377,532,627,771,1049,1216,1533,1692,2257,2538],
        [446,649,767,945,1270,1477,1869,2068,2765,3112],
        [543,807,954,1177,1570,1832,2321,2572,3446,3880],
        [734,1110,1309,1610,2150,2500,3162,3496,4677,5265],
        [1026,1594,1871,2290,3057,3538,4462,4916,6566,7387],
        [1159,1802,2115,2591,3459,4003,5050,5564,7432,8363],
        [1253,1949,2289,2803,3744,4333,5467,6024,8047,9055]
      ]
    }
  },
  Platinum: {
    z1: {
      annual: [
        [5137,9284,10577,12546,16352,18398,22737,24500,32252,36108],
        [6072,10736,12342,14773,19212,21830,27192,29550,39116,43874],
        [7403,12931,14927,17980,23353,26708,33413,36480,48461,54423],
        [10060,17298,19998,24112,31504,36047,45122,49280,65478,73541],
        [14080,24030,27803,33534,44033,50353,63019,68810,91438,102702],
        [15923,27181,31455,37950,49836,56997,71341,77900,103532,116292],
        [17226,29420,34051,41080,53961,61710,77248,84350,112107,125934]
      ],
      hy: [
        [2666,4815,5485,6505,8477,9537,11785,12700,16715,18712],
        [3151,5567,6399,7659,9958,11315,14093,15310,20271,22736],
        [3840,6704,7739,9320,12104,13842,17316,18900,25112,28201],
        [5217,8967,10366,12497,16327,18681,23383,25540,33929,38106],
        [7300,12455,14409,17379,22818,26093,32655,35650,47379,53215],
        [8254,14087,16302,19667,25825,29535,36967,40360,53645,60256],
        [8930,15247,17647,21288,27962,31977,40027,43710,58087,65251]
      ],
      quarterly: [
        [1361,2456,2797,3317,4322,4862,6008,6475,8520,9537],
        [1608,2839,3263,3905,5077,5768,7184,7807,10332,11588],
        [1959,3419,3946,4752,6170,7056,8826,9636,12799,14373],
        [2661,4572,5284,6371,8322,9521,11917,13010,17291,19420],
        [3722,6349,7345,8858,11630,13298,16642,18170,24145,27118],
        [4209,7181,8309,10024,13162,15052,18839,20570,27337,30706],
        [4553,7772,8994,10850,14251,16296,20398,22270,29601,33251]
      ],
      monthly: [
        [468,837,952,1128,1467,1649,2036,2194,2884,3227],
        [551,967,1110,1326,1722,1955,2433,2643,3495,3919],
        [670,1162,1340,1612,2091,2390,2987,3261,4328,4859],
        [906,1551,1792,2158,2817,3222,4030,4401,5844,6562],
        [1265,2151,2487,2998,3933,4496,5625,6141,8157,9161],
        [1429,2432,2813,3391,4450,5088,6366,6952,9235,10372],
        [1545,2631,3044,3670,4818,5508,6893,7526,9999,11231]
      ]
    },
    z2: {
      annual: [
        [4203,7596,8654,10265,13379,15053,18603,20052,26388,29543],
        [4968,8784,10098,12087,15719,17861,22248,24179,32004,35897],
        [6057,10580,12213,14711,19107,21852,27338,29849,39650,44528],
        [8231,14153,16362,19728,25776,29493,36918,40325,53573,60170],
        [11520,19661,22748,27437,36027,41198,51561,56300,74813,84029],
        [13028,22239,25736,31050,40775,46634,58370,63743,84708,95148],
        [14094,24071,27860,33611,44150,50490,63203,69021,91724,103037]
      ],
      hy: [
        [2183,3940,4488,5323,6936,7804,9643,10394,13677,15311],
        [2579,4556,5237,6267,8149,9259,11532,12532,16586,18603],
        [3143,5486,6333,7627,9904,11327,14169,15470,20547,23075],
        [4269,7337,8482,10226,13360,15285,19132,20897,27761,31179],
        [5974,10191,11790,14220,18671,21349,26719,29174,38765,43540],
        [6755,11527,13339,16092,21130,24166,30246,33030,43892,49301],
        [7307,12476,14439,17419,22879,26164,32750,35765,47527,53388]
      ],
      quarterly: [
        [1115,2010,2290,2715,3537,3979,4916,5299,6971,7804],
        [1317,2324,2671,3196,4155,4720,5878,6388,8454,9482],
        [1604,2798,3229,3889,5049,5774,7222,7885,10472,11760],
        [2178,3741,4325,5213,6810,7791,9751,10651,14148,15890],
        [3046,5195,6010,7248,9516,10881,13617,14868,19756,22189],
        [3444,5876,6799,8202,10769,12316,15415,16833,22368,25124],
        [3726,6360,7360,8878,11660,13334,16690,18227,24220,27207]
      ],
      monthly: [
        [379,682,776,920,1197,1346,1663,1792,2356,2637],
        [448,788,905,1082,1406,1596,1987,2159,2857,3203],
        [545,948,1093,1316,1707,1952,2441,2665,3538,3972],
        [738,1266,1463,1763,2302,2633,3294,3598,4778,5366],
        [1031,1757,2032,2450,3215,3676,4599,5021,6671,7492],
        [1166,1986,2298,2772,3638,4160,5206,5684,7552,8483],
        [1261,2150,2487,3000,3939,4504,5636,6155,8178,9186]
      ]
    }
  }
};

// Yuva Bharat Maternity premiums (Platinum only)
// zones: z1, z2; limits: 50K, 75K, 1L; modes: annual, hy, quarterly, monthly
const YB_MATERNITY = {
  z1: {
    '50K': {annual:10096, hy:5231, quarterly:2665, monthly:900},
    '75K': {annual:15144, hy:7846, quarterly:3998, monthly:1349},
    '1L':  {annual:20193, hy:10462, quarterly:5331, monthly:1799}
  },
  z2: {
    '50K': {annual:8260, hy:4280, quarterly:2181, monthly:736},
    '75K': {annual:12390, hy:6419, quarterly:3271, monthly:1104},
    '1L':  {annual:16521, hy:8560, quarterly:4362, monthly:1472}
  }
};

// SI labels
const YB_SI_LABELS = ['₹5 Lakh','₹10 Lakh','₹15 Lakh','₹25 Lakh','₹50 Lakh','₹75 Lakh','₹1 Crore'];
const NIF_SI_LABELS = ['₹2 Lakh','₹3 Lakh','₹5 Lakh','₹8 Lakh','₹10 Lakh','₹12 Lakh','₹15 Lakh'];

// NI Floater – Age 0..100 (index = age, index 100 = >=100)
// Each entry: [2L, 3L, 5L, 8L, 10L, 12L, 15L]
const NIF_Z1 = [
  [2324,2710,3026,3465,3656,3925,4198],[2338,2726,3043,3485,3678,3948,4223],
  [2351,2742,3061,3505,3699,3971,4247],[2365,2758,3079,3526,3721,3994,4272],
  [2378,2774,3096,3546,3742,4017,4296],[2392,2789,3114,3566,3763,4040,4321],
  [2406,2805,3132,3587,3785,4063,4345],[2419,2821,3149,3607,3806,4086,4370],
  [2433,2837,3167,3627,3827,4109,4394],[2446,2853,3185,3647,3849,4132,4419],
  [2565,2994,3344,3834,4079,4382,4688],[2683,3135,3504,4021,4309,4633,4957],
  [2801,3276,3664,4207,4539,4884,5226],[2919,3417,3823,4394,4769,5134,5494],
  [3037,3558,3983,4581,4999,5385,5763],[3156,3699,4143,4767,5229,5636,6032],
  [3274,3840,4302,4954,5460,5887,6301],[3392,3981,4462,5141,5690,6137,6570],
  [3510,4122,4621,5327,5920,6388,6839],[3628,4263,4781,5514,6150,6639,7108],
  [3747,4404,4941,5701,6380,6889,7377],[3865,4545,5100,5887,6610,7140,7646],
  [3983,4686,5260,6074,6840,7391,7914],[4101,4827,5420,6261,7070,7642,8183],
  [4219,4968,5579,6447,7300,7892,8452],[4338,5109,5739,6634,7530,8143,8721],
  [4390,5172,5810,6714,7552,8152,8732],[4443,5235,5881,6795,7573,8160,8742],
  [4495,5297,5952,6875,7594,8169,8752],[4548,5360,6023,6955,7615,8177,8763],
  [4600,5423,6094,7036,7636,8186,8773],[4653,5485,6165,7116,7658,8194,8784],
  [4705,5548,6236,7196,7679,8203,8794],[4758,5611,6307,7276,7700,8212,8805],
  [5067,5979,6724,7762,8215,8762,9397],[5376,6347,7141,8247,8729,9313,9989],
  [5684,6716,7558,8732,9244,9864,10581],[5993,7084,7975,9217,9759,10414,11173],
  [6302,7453,8393,9702,10273,10965,11765],[6566,7767,8749,10117,10713,11435,12271],
  [6830,8082,9105,10531,11153,11905,12777],[7093,8397,9461,10945,11592,12376,13282],
  [7357,8712,9818,11360,12032,12846,13788],[7621,9027,10174,11774,12471,13316,14294],
  [8121,9623,10849,12631,13630,14607,15673],[8621,10220,11525,13488,14788,15898,17052],
  [9121,10816,12200,14345,15946,17189,18432],[9621,11413,12876,15201,17105,18480,19811],
  [10121,12009,13551,16058,18263,19771,21190],[10823,12846,14679,17621,20042,21698,23257],
  [11524,13683,15807,19183,21821,23625,25324],[12226,14520,16935,20745,23601,25552,27391],
  [12927,15357,18063,22308,25380,27479,29458],[13629,16194,19191,23870,27159,29406,31524],
  [14281,16972,19892,24368,27727,30021,32184],[14933,17750,20593,24867,28294,30636,32844],
  [15585,18528,21293,25365,28861,31250,33503],[16237,19306,21994,25863,29429,31865,34163],
  [16889,20084,22695,26361,29996,32479,34823],[17931,21328,24102,27992,31690,34314,36791],
  [18974,22571,25510,29623,33385,36149,38759],[20016,23815,26917,31254,35079,37984,40727],
  [21058,25058,28325,32885,36773,39820,42695],[22100,26302,29733,34516,38468,41655,44663],
  [22285,26521,29981,34803,38788,42002,45035],[22469,26740,30228,35091,39109,42349,45408],
  [22653,26959,30476,35379,39429,42696,45780],[23205,27617,31219,36242,40391,43737,46896],
  [23758,28274,31963,37104,41353,44779,48013],[24310,28932,32706,37967,42314,45820,49130],
  [24863,29590,33449,38830,43276,46862,50246],[25415,30247,34193,39693,44238,47903,51363],
  [25968,30905,34936,40556,45199,48944,52479],[26520,31562,35679,41419,46161,49986,53596],
  [27073,32220,36423,42282,47123,51027,54712],[27625,32877,37166,43145,48084,52068,55829],
  [28178,33535,37909,44008,49046,53110,56946],[28730,34192,38653,44870,50008,54151,58062],
  [29283,34850,39396,45733,50970,55192,59179],[29835,35507,40139,46596,51931,56234,60295],
  [30388,36165,40883,47459,52893,57275,61412],[30941,36822,41626,48322,53855,58317,62529],
  [31493,37480,42369,49185,54816,59358,63645],[32046,38138,43112,50048,55778,60399,64762],
  [32598,38795,43856,50911,56740,61441,65878],[33151,39453,44599,51774,57701,62482,66995],
  [33703,40110,45342,52636,58663,63523,68111],[34256,40768,46086,53499,59625,64565,69228],
  [34808,41425,46829,54362,60586,65606,70345],[35361,42083,47572,55225,61548,66648,71461],
  [35913,42740,48316,56088,62510,67689,72578],[36466,43398,49059,56951,63471,68730,73694],
  [37018,44055,49802,57814,64433,69772,74811],[37571,44713,50546,58677,65395,70813,75927],
  [38123,45371,51289,59540,66357,71854,77044],[38676,46028,52032,60403,67318,72896,78161],
  [39228,46686,52776,61265,68280,73937,79277],[39781,47343,53519,62128,69242,74978,80394],
  [40333,48001,54262,62991,70203,76020,81510],[40886,48658,55006,63854,71165,77061,82627],
  [41438,49316,55749,64717,72127,78103,83744]
];

const NIF_Z2 = [
  [1980,2309,2577,2952,3115,3344,3576],[1991,2322,2592,2969,3133,3363,3597],
  [2003,2336,2608,2986,3151,3383,3618],[2015,2349,2623,3003,3169,3402,3639],
  [2026,2363,2638,3021,3188,3422,3660],[2038,2376,2653,3038,3206,3441,3681],
  [2049,2390,2668,3055,3224,3461,3702],[2061,2403,2683,3072,3242,3480,3722],
  [2072,2417,2698,3090,3260,3500,3743],[2084,2430,2713,3107,3279,3519,3764],
  [2185,2550,2849,3266,3475,3733,3993],[2285,2670,2985,3425,3671,3947,4222],
  [2386,2791,3121,3584,3867,4160,4451],[2487,2911,3257,3743,4063,4374,4680],
  [2587,3031,3393,3902,4259,4587,4910],[2688,3151,3529,4061,4455,4801,5139],
  [2789,3271,3665,4220,4651,5014,5368],[2890,3391,3801,4379,4847,5228,5597],
  [2990,3511,3937,4538,5043,5442,5826],[3091,3632,4073,4697,5239,5655,6055],
  [3192,3752,4209,4856,5435,5869,6284],[3292,3872,4345,5015,5631,6082,6513],
  [3393,3992,4481,5174,5827,6296,6742],[3494,4112,4617,5333,6023,6509,6971],
  [3594,4232,4753,5492,6219,6723,7200],[3695,4352,4889,5651,6415,6937,7429],
  [3740,4406,4949,5720,6433,6944,7438],[3785,4459,5010,5788,6451,6951,7447],
  [3829,4512,5070,5856,6469,6959,7456],[3874,4566,5131,5925,6487,6966,7465],
  [3919,4619,5191,5993,6505,6973,7474],[3963,4673,5251,6062,6523,6980,7482],
  [4008,4726,5312,6130,6541,6988,7491],[4053,4779,5372,6198,6559,6995,7500],
  [4316,5093,5728,6612,6998,7464,8005],[4579,5407,6083,7025,7436,7933,8509],
  [4842,5721,6438,7438,7875,8402,9013],[5105,6035,6794,7852,8313,8871,9518],
  [5368,6349,7149,8265,8751,9340,10022],[5593,6617,7453,8618,9126,9741,10453],
  [5818,6885,7756,8971,9500,10142,10884],[6043,7153,8060,9324,9875,10542,11315],
  [6267,7421,8363,9677,10249,10943,11746],[6492,7689,8667,10030,10624,11344,12176],
  [6918,8198,9242,10760,11611,12443,13351],[7344,8706,9817,11490,12597,13543,14526],
  [7770,9214,10393,12219,13584,14642,15701],[8196,9722,10968,12949,14571,15742,16876],
  [8622,10230,11543,13679,15557,16842,18051],[9219,10943,12504,15010,17073,18483,19812],
  [9817,11656,13465,16341,18589,20125,21572],[10415,12369,14426,17672,20104,21767,23333],
  [11012,13082,15387,19003,21620,23408,25093],[11610,13795,16348,20334,23136,25050,26854],
  [12165,14458,16945,20758,23619,25573,27416],[12721,15121,17542,21183,24102,26097,27978],
  [13276,15783,18139,21607,24586,26620,28540],[13832,16446,18736,22032,25069,27144,29102],
  [14387,17109,19332,22456,25552,27667,29664],[15275,18168,20531,23845,26995,29231,31340],
  [16163,19227,21731,25234,28439,30794,33017],[17051,20287,22930,26624,29882,32357,34693],
  [17938,21346,24129,28013,31325,33920,36370],[18826,22405,25328,29402,32769,35484,38046],
  [18983,22592,25539,29647,33042,35779,38364],[19140,22779,25750,29892,33315,36075,38681],
  [19297,22965,25961,30137,33588,36371,38998],[19768,23525,26594,30872,34407,37258,39949],
  [20238,24086,27227,31607,35226,38145,40900],[20709,24646,27861,32343,36046,39032,41851],
  [21180,25206,28494,33078,36865,39919,42802],[21650,25766,29127,33813,37684,40806,43753],
  [22121,26326,29760,34548,38503,41693,44705],[22591,26886,30393,35283,39322,42580,45656],
  [23062,27446,31027,36018,40142,43467,46607],[23533,28007,31660,36753,40961,44355,47558],
  [24003,28567,32293,37488,41780,45242,48509],[24474,29127,32926,38223,42599,46129,49460],
  [24945,29687,33559,38958,43418,47016,50412],[25415,30247,34193,39693,44238,47903,51363],
  [25886,30807,34826,40428,45057,48790,52314],[26357,31367,35459,41163,45876,49677,53265],
  [26827,31927,36092,41898,46695,50564,54216],[27298,32488,36725,42633,47515,51451,55167],
  [27769,33048,37359,43368,48334,52338,56119],[28239,33608,37992,44103,49153,53225,57070],
  [28710,34168,38625,44838,49972,54113,58021],[29181,34728,39258,45574,50791,55000,58972],
  [29651,35288,39891,46309,51611,55887,59923],[30122,35848,40525,47044,52430,56774,60874],
  [30593,36408,41158,47779,53249,57661,61825],[31063,36969,41791,48514,54068,58548,62777],
  [31534,37529,42424,49249,54888,59435,63728],[32005,38089,43057,49984,55707,60322,64679],
  [32475,38649,43691,50719,56526,61209,65630],[32946,39209,44324,51454,57345,62096,66581],
  [33417,39769,44957,52189,58164,62983,67532],[33887,40329,45590,52924,58984,63871,68484],
  [34358,40890,46223,53659,59803,64758,69435],[34829,41450,46857,54394,60622,65645,70386],
  [35299,42010,47490,55129,61441,66532,71337]
];

// NI Floater Cataract optional cover premiums by SI index (3=8L,4=10L,5=12L,6=15L) and age band
// Age bands: <50=0, 51-55=1, 56-60=2, 61-65=3, >65=4
const NIF_CATARACT = {
  3: [444,1049,2269,3645,3893],
  4: [555,1311,2836,4556,4866],
  5: [666,1573,3404,5467,5839],
  6: [832,1967,4255,6834,7299]
};

// =============================================================================
// LOOKUP FUNCTIONS
// =============================================================================

function getYBAgeBandIdx(age) {
  if (age <= 17) return 0;
  if (age <= 30) return 1;
  if (age <= 35) return 2;
  if (age <= 40) return 3;
  if (age <= 45) return 4;
  if (age <= 50) return 5;
  if (age <= 55) return 6;
  if (age <= 60) return 7;
  if (age <= 65) return 8;
  return 9;
}

function getYBPremium(plan, zone, mode, siIdx, age) {
  const band = getYBAgeBandIdx(age);
  const tbl = YB[plan][zone][mode];
  if (tbl) return tbl[siIdx][band];
  // Zone2 Basic HY/Qtr/Monthly: derive from z1 × 0.8182
  const z1val = YB[plan].z1[mode][siIdx][band];
  return Math.round(z1val * 0.8182);
}

function getNIFCataractBandIdx(age) {
  if (age < 50) return 0;
  if (age <= 55) return 1;
  if (age <= 60) return 2;
  if (age <= 65) return 3;
  return 4;
}

function getNIFPremium(zone, siIdx, age) {
  const idx = Math.min(age, 100);
  return zone === 'z1' ? NIF_Z1[idx][siIdx] : NIF_Z2[idx][siIdx];
}


// =============================================================================
// STATE
// =============================================================================
let members = [];
let quoteResult = null;

// =============================================================================
// UI SETUP
// =============================================================================
function init() {
  addMember(); addMember();
  onProductChange(); updateProductDesc(); updateZoneDesc();
}

function onProductChange() {
  const p = getProduct();
  document.getElementById('ybOptions').classList.toggle('hidden', p !== 'yb');
  document.getElementById('nifOptions').classList.toggle('hidden', p !== 'nif');
  syncMembersFromDOM(); updateProductDesc(); updateZoneDesc(); renderMembers();
}

function getProduct() { return document.querySelector('input[name=product]:checked').value; }

function updateProductDesc() {
  const p = getProduct();
  const el = document.getElementById('productDesc');
  if (p === 'yb') el.innerHTML = '<span class="info-pill">Yuva Bharat</span> &nbsp;Individual &amp; Floater · Basic / Gold / Platinum · SI ₹5L–₹1Cr · Annual / Half-Yearly / Quarterly / Monthly · UIN: NIAHLIP25059V042425';
  else el.innerHTML = '<span class="info-pill">NI Floater</span> &nbsp;Floater only · SI ₹2L–₹15L · Annual premium · Per-year age pricing · UIN: NIAHLIP25039V092425';
}

function onZoneChange() { syncMembersFromDOM(); updateZoneDesc(); renderMembers(); }

function updateZoneDesc() {
  const z = document.getElementById('zone').value;
  const p = getProduct();
  const el = document.getElementById('zoneDesc');
  if (p === 'yb') {
    el.innerHTML = z === 'z1'
      ? '📍 <strong>Zone 1:</strong> Delhi/NCR · Mumbai · Mumbai Suburban · Thane · Navi Mumbai · Surat · Ahmedabad · Vadodara'
      : '📍 <strong>Zone 2:</strong> Rest of India';
  } else {
    el.innerHTML = z === 'z1'
      ? '📍 <strong>Zone 1:</strong> Maharashtra and Gujarat'
      : '📍 <strong>Zone 2:</strong> Rest of India &nbsp;<span style="color:#d97706;font-weight:700">(20% co-pay if treated in Zone 1)</span>';
  }
}

function onYBPlanChange() {
  const plan = document.getElementById('ybPlan').value;
  document.getElementById('ybMaternitySection').classList.toggle('hidden', plan !== 'Platinum');
  if (plan !== 'Platinum') { document.getElementById('ybMaternity').checked = false; document.getElementById('ybMaternityLimit').classList.add('hidden'); }
}

function onYBMaternityChange() {
  document.getElementById('ybMaternityLimit').classList.toggle('hidden', !document.getElementById('ybMaternity').checked);
}

function onNIFSIChange() {
  const siIdx = parseInt(document.getElementById('nifSI').value);
  document.getElementById('nifCataractSection').classList.toggle('hidden', siIdx < 3);
  if (siIdx < 3) document.getElementById('nifCataract').checked = false;
}

// =============================================================================
// MEMBER MANAGEMENT
// =============================================================================
let _mid = 0;

// Real-time update from inline handlers
function setMF(id, field, value) {
  const m = members.find(x => x.id === id);
  if (m) m[field] = value;
}

function onAgeInput(id, val) {
  const age = parseInt(val) || 0;
  const p = getProduct();
  // Age restriction warning
  const warn = document.getElementById(`m${id}_agewarn`);
  if (warn) {
    if (p === 'yb' && age > 65)
      warn.textContent = '⚠ Max entry age for Yuva Bharat is 65 years';
    else if (p === 'nif' && age > 100)
      warn.textContent = '⚠ Age above 100 may not be covered';
    else
      warn.textContent = '';
  }
  // Disable HP section for under-18
  const hp = document.getElementById(`m${id}_hp`);
  if (hp) {
    const under18 = val !== '' && age < 18;
    hp.style.opacity = under18 ? '0.45' : '1';
    hp.style.pointerEvents = under18 ? 'none' : '';
  }
}

// Fallback DOM read — called before any re-render and before calculate
function syncMembersFromDOM() {
  members.forEach(m => {
    const v = k => document.getElementById(`m${m.id}_${k}`);
    if (v('name'))   m.name   = v('name').value;
    if (v('age'))    m.age    = v('age').value;
    if (v('bmi'))    m.bmi    = v('bmi').value;
    if (v('hba1c'))  m.hba1c  = v('hba1c').value;
    if (v('bp'))     m.bp     = v('bp').value;
    if (v('nohosp')) m.noHosp = v('nohosp').checked;
  });
}

function addMember() {
  syncMembersFromDOM();
  const id = ++_mid;
  members.push({id, age:'', name:`Member ${members.length+1}`, bmi:'normal', hba1c:'normal', bp:'normal', noHosp:false});
  renderMembers();
}

function removeMember(id) {
  syncMembersFromDOM();
  members = members.filter(m => m.id !== id);
  renderMembers();
}

function collectMembers() {
  syncMembersFromDOM(); // always pull latest DOM values
  return members.map(m => ({
    id:     m.id,
    name:   m.name   || 'Member',
    age:    parseInt(m.age) || 0,
    bmi:    m.bmi    || 'normal',
    hba1c:  m.hba1c  || 'normal',
    bp:     m.bp     || 'normal',
    noHosp: !!m.noHosp
  }));
}

function renderMembers() {
  const p = getProduct();
  const c = document.getElementById('membersContainer');
  if (!members.length) { c.innerHTML = '<p style="color:var(--muted);font-size:13px;padding:10px 0">No members. Click "+ Add Member".</p>'; return; }
  c.innerHTML = members.map((m, i) => {
    const showHP = p === 'yb';
    return `<div class="member-block">
      <div class="member-header">
        <div class="member-label"><div class="member-num">${i+1}</div>${m.name||'Member '+(i+1)}</div>
        ${members.length>1 ? `<button class="btn btn-danger btn-sm" onclick="removeMember(${m.id})">✕ Remove</button>` : ''}
      </div>
      <div class="form-grid">
        <div class="form-group"><span class="form-label">Name / Relation</span><input type="text" id="m${m.id}_name" value="${m.name||''}" placeholder="e.g. Self, Spouse, Son" oninput="setMF(${m.id},'name',this.value)"></div>
        <div class="form-group"><span class="form-label">Age (years)</span>
          <input type="number" id="m${m.id}_age" value="${m.age||''}" min="0" max="120" placeholder="Age in years" oninput="setMF(${m.id},'age',this.value);onAgeInput(${m.id},this.value)">
          <span id="m${m.id}_agewarn" style="font-size:11px;color:#dc2626;margin-top:3px;display:block"></span>
        </div>
      </div>
      ${showHP ? `<div id="m${m.id}_hp" style="background:rgba(37,99,168,.06);border-radius:8px;padding:10px 12px;margin-top:4px;${parseInt(m.age||0)<18&&m.age!==''?'opacity:.45;pointer-events:none':''}">
        <div style="font-size:11px;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Health Parameters (18+ only · affects discount / loading)</div>
        <div class="form-grid" style="grid-template-columns:repeat(auto-fit,minmax(165px,1fr))">
          <div class="form-group"><span class="form-label">BMI</span>
            <select id="m${m.id}_bmi" onchange="setMF(${m.id},'bmi',this.value)">
              <option value="good" ${m.bmi==='good'?'selected':''}>18.5–32 &nbsp;(−2.5%)</option>
              <option value="normal" ${(m.bmi||'normal')==='normal'?'selected':''}>Not specified (0%)</option>
              <option value="high" ${m.bmi==='high'?'selected':''}>Above 32 &nbsp;(+2.5%)</option>
            </select>
          </div>
          <div class="form-group"><span class="form-label">HbA1c / Diabetes</span>
            <select id="m${m.id}_hba1c" onchange="setMF(${m.id},'hba1c',this.value)">
              <option value="good" ${m.hba1c==='good'?'selected':''}>Non-diabetic &lt;6.4 (−2.5%)</option>
              <option value="normal" ${(m.hba1c||'normal')==='normal'?'selected':''}>Not specified (0%)</option>
              <option value="high" ${m.hba1c==='high'?'selected':''}>Diabetic &gt;6.4 (+2.5%)</option>
            </select>
          </div>
          <div class="form-group"><span class="form-label">Blood Pressure</span>
            <select id="m${m.id}_bp" onchange="setMF(${m.id},'bp',this.value)">
              <option value="good" ${m.bp==='good'?'selected':''}>≤120/80 &nbsp;(−2.5%)</option>
              <option value="normal" ${(m.bp||'normal')==='normal'?'selected':''}>120–139/89 (0%)</option>
              <option value="high" ${m.bp==='high'?'selected':''}>Above 139/89 (+2.5%)</option>
            </select>
          </div>
          <div class="form-group" style="justify-content:flex-end">
            <label class="choice-pill" style="margin-top:18px;font-size:12px">
              <input type="checkbox" id="m${m.id}_nohosp" ${m.noHosp?'checked':''} onchange="setMF(${m.id},'noHosp',this.checked)"> No hosp. last 3 yrs (−2.5%)
            </label>
          </div>
        </div>
      </div>` : ''}
    </div>`;
  }).join('');
}

// =============================================================================
// CALCULATION
// =============================================================================
function fmt(n) { return '₹' + Math.round(n).toLocaleString('en-IN'); }

function calculate() {
  const mems = collectMembers();
  if (!mems.length) { alert('Please add at least one member.'); return; }
  for (const m of mems) if (!m.age || m.age < 0 || m.age > 120) { alert(`Enter valid age for ${m.name}.`); return; }
  const p = getProduct();
  if (p === 'yb') calculateYB(mems); else calculateNIF(mems);
  document.getElementById('resultsSection').classList.remove('hidden');
  if (document.getElementById('showCommission').checked) renderCommission();
  document.getElementById('resultsSection').scrollIntoView({behavior:'smooth',block:'start'});
}

function calculateYB(mems) {
  const plan = document.getElementById('ybPlan').value;
  const siIdx = parseInt(document.getElementById('ybSI').value);
  const coverage = document.getElementById('ybCoverage').value;
  const mode = document.getElementById('ybMode').value;
  const term = parseInt(document.getElementById('ybTerm').value);
  const zone = document.getElementById('zone').value;
  const loyalty = document.getElementById('ybLoyalty').checked;
  const maternity = document.getElementById('ybMaternity')?.checked && plan === 'Platinum';
  const matLimitIdx = maternity ? parseInt(document.getElementById('ybMaternityLimitVal')?.value||0) : -1;
  const modeLabel = {annual:'Annual',hy:'Half-Yearly',quarterly:'Quarterly',monthly:'Monthly'}[mode];
  const termDisc = term===2?0.05:term===3?0.07:0;
  const floaterDisc = coverage==='floater'?(mems.length>=4?0.15:mems.length===3?0.10:mems.length===2?0.05:0):0;

  const memberRows = mems.map(m => {
    const base = getYBPremium(plan, zone, mode, siIdx, m.age);
    let hpNet = 0;
    const hpDiscounts = [];
    if (m.age >= 18) {
      if (m.bmi==='good')   { hpNet-=2.5; hpDiscounts.push({label:'BMI 18.5-32',pct:-2.5}); }
      if (m.bmi==='high')   { hpNet+=2.5; hpDiscounts.push({label:'BMI Above 32 (Loading)',pct:+2.5}); }
      if (m.hba1c==='good') { hpNet-=2.5; hpDiscounts.push({label:'HbA1c < 6.4 — Non-diabetic',pct:-2.5}); }
      if (m.hba1c==='high') { hpNet+=2.5; hpDiscounts.push({label:'HbA1c > 6.4 — Diabetic (Loading)',pct:+2.5}); }
      if (m.bp==='good')    { hpNet-=2.5; hpDiscounts.push({label:'BP <= 120/80',pct:-2.5}); }
      if (m.bp==='high')    { hpNet+=2.5; hpDiscounts.push({label:'BP Above 139/89 (Loading)',pct:+2.5}); }
      if (m.noHosp)         { hpNet-=2.5; hpDiscounts.push({label:'No Hospitalisation — Last 3 Years',pct:-2.5}); }
    }
    return {name:m.name, age:m.age, base, hpNet, hpDiscounts, afterHP:base*(1+hpNet/100)};
  });

  const subtotal = memberRows.reduce((s,r)=>s+r.afterHP,0);
  const afterFloater = subtotal*(1-floaterDisc);
  const afterLoyalty = afterFloater*(1-(loyalty?0.025:0));
  const afterTerm = afterLoyalty*(1-termDisc);
  const matKeys=['50K','75K','1L'], matLabels=['₹50,000','₹75,000','₹1,00,000'];
  const matPrem = maternity ? (YB_MATERNITY[zone][matKeys[matLimitIdx]][mode]||0) : 0;
  const grandTotal = afterTerm + matPrem;

  quoteResult = {
    product:'Yuva Bharat Health Policy', plan, zone, siIdx, coverage,
    mode:modeLabel, term, siLabel:YB_SI_LABELS[siIdx],
    zoneLabel:zone==='z1'?'Zone 1':'Zone 2',
    memberRows, subtotal, floaterDisc, afterFloater, loyalty, afterLoyalty,
    termDisc, afterTerm, maternity, matLabel:maternity?matLabels[matLimitIdx]:'',
    matPrem, grandTotal, mems
  };

  // Render meta
  const el = document.getElementById('quoteHeader');
  el.innerHTML = [
    `<span>${plan} Plan</span>`,
    `<span>${quoteResult.zoneLabel}</span>`,
    `<span>SI: ${YB_SI_LABELS[siIdx]}</span>`,
    `<span>${coverage==='floater'?'Family Floater':'Individual'}</span>`,
    `<span>${modeLabel}</span>`,
    `<span>Term: ${term} Yr${term>1?'s':''}</span>`,
    `<span>GST: Nil</span>`
  ].join(' ');

  // Table
  const cols = 5;
  document.getElementById('quoteTableHead').innerHTML = '<th>Member</th><th>Age</th><th>Base Premium</th><th>Discount / Loading</th><th>Premium</th>';
  document.getElementById('quoteTableBody').innerHTML =
    memberRows.map(r => `<tr>
      <td>${r.name}</td><td>${r.age}</td><td>${fmt(r.base)}</td>
      <td style="color:${r.hpNet<0?'#6ee7b7':r.hpNet>0?'#fca5a5':'rgba(255,255,255,.5)'}">${r.hpNet?((r.hpNet>0?'+':'')+r.hpNet+'%'):'—'}</td>
      <td>${fmt(r.afterHP)}</td></tr>`).join('')
    + `<tr class="rt-sub"><td colspan="4">Sub-total</td><td>${fmt(subtotal)}</td></tr>`
    + (floaterDisc?`<tr class="rt-disc"><td colspan="4">Floater Discount (${mems.length} members, −${floaterDisc*100}%)</td><td>−${fmt(subtotal*floaterDisc)}</td></tr>`:'')
    + (loyalty?`<tr class="rt-disc"><td colspan="4">Loyalty Discount −2.5%</td><td>−${fmt(afterFloater*0.025)}</td></tr>`:'')
    + (termDisc?`<tr class="rt-disc"><td colspan="4">Long-Term Discount (${term} yrs, −${termDisc*100}%)</td><td>−${fmt(afterLoyalty*termDisc)}</td></tr>`:'')
    + (maternity?`<tr><td colspan="4">Optional: Enhanced Maternity (${matLabels[matLimitIdx]})</td><td>${fmt(matPrem)}</td></tr>`:'')
    + `<tr class="rt-total"><td colspan="4">TOTAL ${modeLabel.toUpperCase()} PREMIUM</td><td>${fmt(grandTotal)}</td></tr>`;

  document.getElementById('quoteNotes').innerHTML = '';
}

function calculateNIF(mems) {
  const siIdx = parseInt(document.getElementById('nifSI').value);
  const term = parseInt(document.getElementById('nifTerm').value);
  const zone = document.getElementById('zone').value;
  const cataract = document.getElementById('nifCataract')?.checked && siIdx >= 3;
  const termDisc = term===2?0.05:term===3?0.07:0;
  const floaterDisc = mems.length>=4?0.15:mems.length===3?0.10:mems.length===2?0.05:0;

  const memberRows = mems.map(m => {
    const base = getNIFPremium(zone, siIdx, m.age);
    const catPrem = cataract ? ((NIF_CATARACT[siIdx]||[])[getNIFCataractBandIdx(m.age)]||0) : 0;
    return {name:m.name, age:m.age, base, catPrem};
  });

  const subtotal = memberRows.reduce((s,r)=>s+r.base,0);
  const catTotal = memberRows.reduce((s,r)=>s+r.catPrem,0);
  const combined = subtotal + catTotal;
  const afterFloater = combined*(1-floaterDisc);
  const afterTerm = afterFloater*(1-termDisc);

  quoteResult = {
    product:'New India Floater Mediclaim Policy',
    zone, siIdx, term, siLabel:NIF_SI_LABELS[siIdx],
    zoneLabel:zone==='z1'?'Zone 1 (Maharashtra & Gujarat)':'Zone 2 (Rest of India)',
    memberRows, subtotal, catTotal, combined, floaterDisc, afterFloater,
    termDisc, afterTerm:Math.round(afterTerm), cataract, mems
  };

  const el = document.getElementById('quoteHeader');
  el.innerHTML = [
    `<span>${quoteResult.zoneLabel}</span>`,
    `<span>SI: ${NIF_SI_LABELS[siIdx]}</span>`,
    `<span>Family Floater</span>`,
    `<span>Annual</span>`,
    `<span>Term: ${term} Yr${term>1?'s':''}</span>`,
    `<span>GST: Nil</span>`,
    zone==='z2'?`<span style="background:rgba(239,68,68,.2);color:#fca5a5">20% Co-pay if treated in Zone 1</span>`:''
  ].join(' ');

  const hasCat = cataract;
  const cols = hasCat ? 5 : 3;
  document.getElementById('quoteTableHead').innerHTML = hasCat
    ? '<th>Member</th><th>Age</th><th>Base Premium</th><th>Cataract Cover</th><th>Member Total</th>'
    : '<th>Member</th><th>Age</th><th>Base Premium</th>';
  document.getElementById('quoteTableBody').innerHTML =
    memberRows.map(r => hasCat
      ? `<tr><td>${r.name}</td><td>${r.age}</td><td>${fmt(r.base)}</td><td>${fmt(r.catPrem)}</td><td>${fmt(r.base+r.catPrem)}</td></tr>`
      : `<tr><td>${r.name}</td><td>${r.age}</td><td>${fmt(r.base)}</td></tr>`).join('')
    + `<tr class="rt-sub"><td colspan="${cols-1}">Sub-total</td><td>${fmt(combined)}</td></tr>`
    + (floaterDisc?`<tr class="rt-disc"><td colspan="${cols-1}">Floater Discount (${mems.length} members, −${floaterDisc*100}%)</td><td>−${fmt(combined*floaterDisc)}</td></tr>`:'')
    + (termDisc?`<tr class="rt-disc"><td colspan="${cols-1}">Long-Term Discount (${term} yrs, −${termDisc*100}%)</td><td>−${fmt(afterFloater*termDisc)}</td></tr>`:'')
    + `<tr class="rt-total"><td colspan="${cols-1}">TOTAL ANNUAL PREMIUM</td><td>${fmt(afterTerm)}</td></tr>`;

  document.getElementById('quoteNotes').innerHTML = '';
}

function resetForm() {
  members = []; addMember(); addMember();
  document.getElementById('resultsSection').classList.add('hidden');
  quoteResult = null;
  window.scrollTo({top:0,behavior:'smooth'});
}

// =============================================================================
// COMMISSION
// =============================================================================
function getCommissionRates(oldestAge) {
  if (oldestAge < 40) return {commPct:15,incPct:25,totalPct:40,band:'Below 40 years'};
  if (oldestAge < 55) return {commPct:15,incPct:12,totalPct:27,band:'40 to <55 years'};
  return {commPct:15,incPct:0,totalPct:15,band:'55 years & above'};
}

function toggleCommission() {
  const cb = document.getElementById('showCommission');
  cb.checked = !cb.checked;
  const on = cb.checked;
  document.getElementById('toggleViz').classList.toggle('on', on);
  document.getElementById('toggleLabel').textContent = on ? 'Hide' : 'Show';
  document.getElementById('commissionBody').classList.toggle('hidden', !on);
  if (on && quoteResult) renderCommission();
}

function renderCommission() {
  if (!quoteResult) return;
  const mems = quoteResult.mems;
  const oldestAge = Math.max(...mems.map(m => m.age||0));
  const totalPremium = quoteResult.grandTotal ?? quoteResult.afterTerm;
  const rates = getCommissionRates(oldestAge);
  const commission = Math.round(totalPremium * rates.commPct / 100);
  const incentive  = Math.round(totalPremium * rates.incPct  / 100);
  const totalAward = Math.round(totalPremium * rates.totalPct / 100);

  document.getElementById('commOldestAge').textContent = oldestAge + ' yrs';
  document.getElementById('commBand').textContent = rates.band;
  document.getElementById('sc1').textContent = fmt(commission);
  document.getElementById('sc2').textContent = fmt(incentive);
  document.getElementById('sc3').textContent = fmt(totalAward);
  document.getElementById('sb1').textContent = rates.commPct + '%';
  document.getElementById('sb2').textContent = rates.incPct + '%';
  document.getElementById('sb3').textContent = rates.totalPct + '%';
  document.getElementById('scBase').textContent = fmt(totalPremium);
}

// =============================================================================
// PDF GENERATION — two-column layout matching NIA sample quotation
// =============================================================================
// SHARED PRINT HELPERS
// =============================================================================
function _printBadgeSVG() {
  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" width="68" height="68">
  <defs>
    <path id="pb-arc-top"  d="M 22,150 A 128,128 0 0,1 278,150" fill="none"/>
    <path id="pb-arc-top2" d="M 42,150 A 108,108 0 0,1 258,150" fill="none"/>
    <path id="pb-arc-bot"  d="M 22,150 A 128,128 0 0,0 278,150" fill="none"/>
    <path id="pb-arc-bot2" d="M 50,150 A 100,100 0 0,0 250,150" fill="none"/>
  </defs>
  <circle cx="150" cy="150" r="146" fill="#e8621a"/>
  <circle cx="150" cy="150" r="136" fill="#fff"/>
  <circle cx="150" cy="150" r="133" fill="#c9a227"/>
  <circle cx="150" cy="150" r="128" fill="#1a2b5e"/>
  <circle cx="150" cy="150" r="122" fill="none" stroke="#c9a227" stroke-width="2"/>
  <circle cx="150" cy="150" r="119" fill="none" stroke="#c9a227" stroke-width="0.8"/>
  <text font-family="Arial Black,Arial,sans-serif" font-size="22" font-weight="900" fill="#fff" letter-spacing="6"><textPath href="#pb-arc-top" startOffset="50%" text-anchor="middle">SAMBHAL</textPath></text>
  <text font-family="Arial,sans-serif" font-size="11" font-weight="700" fill="#e8c547" letter-spacing="2.5"><textPath href="#pb-arc-top2" startOffset="50%" text-anchor="middle">UTTAR PRADESH</textPath></text>
  <text font-family="Arial Black,Arial,sans-serif" font-size="20" font-weight="900" fill="#fff" letter-spacing="5"><textPath href="#pb-arc-bot" startOffset="50%" text-anchor="middle">NEW INDIA</textPath></text>
  <text font-family="Arial,sans-serif" font-size="8.5" font-weight="600" fill="#e8c547" letter-spacing="0.8"><textPath href="#pb-arc-bot2" startOffset="50%" text-anchor="middle">PROGRESS | HERITAGE | DEVELOPMENT</textPath></text>
  <g transform="translate(32,150)" opacity="0.9">
    <line x1="0" y1="28" x2="0" y2="-28" stroke="#3a7d1e" stroke-width="1.5"/>
    <ellipse cx="-7" cy="20" rx="8" ry="4" fill="#4a9e28" transform="rotate(-40,-7,20)"/>
    <ellipse cx="-8" cy="8" rx="8" ry="4" fill="#5cb832" transform="rotate(-50,-8,8)"/>
    <ellipse cx="-7" cy="-4" rx="7" ry="3.5" fill="#4a9e28" transform="rotate(-55,-7,-4)"/>
    <ellipse cx="-5" cy="-16" rx="6" ry="3" fill="#5cb832" transform="rotate(-60,-5,-16)"/>
    <ellipse cx="7" cy="20" rx="8" ry="4" fill="#5cb832" transform="rotate(40,7,20)"/>
    <ellipse cx="8" cy="8" rx="8" ry="4" fill="#4a9e28" transform="rotate(50,8,8)"/>
    <ellipse cx="7" cy="-4" rx="7" ry="3.5" fill="#5cb832" transform="rotate(55,7,-4)"/>
    <ellipse cx="5" cy="-16" rx="6" ry="3" fill="#4a9e28" transform="rotate(60,5,-16)"/>
  </g>
  <g transform="translate(268,150)" opacity="0.9">
    <line x1="0" y1="28" x2="0" y2="-28" stroke="#3a7d1e" stroke-width="1.5"/>
    <ellipse cx="-7" cy="20" rx="8" ry="4" fill="#4a9e28" transform="rotate(-40,-7,20)"/>
    <ellipse cx="-8" cy="8" rx="8" ry="4" fill="#5cb832" transform="rotate(-50,-8,8)"/>
    <ellipse cx="-7" cy="-4" rx="7" ry="3.5" fill="#4a9e28" transform="rotate(-55,-7,-4)"/>
    <ellipse cx="-5" cy="-16" rx="6" ry="3" fill="#5cb832" transform="rotate(-60,-5,-16)"/>
    <ellipse cx="7" cy="20" rx="8" ry="4" fill="#5cb832" transform="rotate(40,7,20)"/>
    <ellipse cx="8" cy="8" rx="8" ry="4" fill="#4a9e28" transform="rotate(50,8,8)"/>
    <ellipse cx="7" cy="-4" rx="7" ry="3.5" fill="#5cb832" transform="rotate(55,7,-4)"/>
    <ellipse cx="5" cy="-16" rx="6" ry="3" fill="#4a9e28" transform="rotate(60,5,-16)"/>
  </g>
  <path d="M150,62 L195,78 L195,138 Q195,178 150,200 Q105,178 105,138 L105,78 Z" fill="#c9a227" stroke="#c9a227" stroke-width="2"/>
  <path d="M150,67 L191,83 L191,138 Q191,176 150,197 Q109,176 109,138 L109,83 Z" fill="#12205a"/>
  <g transform="translate(150,130) scale(0.48)">
    <path d="M0,-95 C-5,-98 -17,-95 -23,-88 C-30,-81 -35,-70 -38,-58 C-42,-46 -46,-35 -44,-23 C-41,-10 -48,-5 -51,4 C-54,13 -51,22 -48,30 C-44,38 -46,46 -41,53 C-36,60 -28,62 -24,70 C-18,80 -21,90 -14,97 C-7,104 2,107 10,110 C18,113 24,120 32,122 C40,124 46,118 54,114 C62,110 70,108 76,102 C82,96 82,86 86,78 C90,70 96,64 96,54 C96,44 90,36 88,26 C86,16 90,6 86,-4 C82,-14 74,-18 69,-28 C64,-38 66,-50 59,-58 C52,-66 40,-68 32,-76 C24,-84 22,-96 12,-102 C4,-108 9,-100 0,-95 Z" fill="#c9a227" stroke="#e8d060" stroke-width="1.5" opacity="0.92"/>
    <path d="M0,-95 C-5,-102 -15,-105 -20,-98 C-25,-91 -20,-82 -12,-80 C-5,-78 2,-86 0,-95 Z" fill="#c9a227" stroke="#e8d060" stroke-width="1" opacity="0.92"/>
    <circle cx="-10" cy="-18" r="4" fill="#fff" opacity="0.85"/>
  </g>
  <rect x="116" y="177" width="68" height="20" rx="3" fill="#c9a227"/>
  <text x="150" y="192" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-size="12" font-weight="900" fill="#12205a" letter-spacing="2">UP - 38</text>
  <circle cx="150" cy="214" r="9" fill="none" stroke="#fff" stroke-width="1.5"/>
  <circle cx="150" cy="214" r="2" fill="#1a3a8a"/>
  <path d="M137,220 Q150,230 163,220" stroke="#f97316" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M137,225 Q150,235 163,225" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M138,229 Q150,239 162,229" stroke="#138808" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>`;
}

function _printCSS() {
  return `
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#1a1a2e;background:#f4f6fb}
  .page{max-width:820px;margin:20px auto;background:#fff;box-shadow:0 2px 24px rgba(0,0,0,.13)}
  /* HEADER */
  .q-header{background:linear-gradient(135deg,#0d1b3e 0%,#162c5c 100%);display:flex;align-items:center;justify-content:space-between;padding:20px 28px}
  .q-logo-wrap{display:flex;align-items:center;gap:16px}
  .q-brand h1{color:#fff;font-size:1.35em;font-weight:700;letter-spacing:0.3px;line-height:1.2}
  .q-brand p{color:rgba(255,255,255,.55);font-size:.72em;letter-spacing:1.8px;margin-top:4px;text-transform:uppercase}
  .q-title-right{text-align:right}
  .q-type{color:rgba(255,255,255,.5);font-size:.68em;letter-spacing:2.5px;text-transform:uppercase;font-weight:600;margin-bottom:4px}
  .q-title{color:#fff;font-size:1.45em;font-style:italic;font-weight:300;letter-spacing:.5px}
  /* META BAR */
  .q-meta{background:#f9f5ea;border-bottom:1px solid #e6dfc8;display:flex}
  .q-meta-cell{flex:1;padding:10px 20px;border-right:1px solid #e6dfc8}
  .q-meta-cell:last-child{border-right:none}
  .q-meta-cell .mlabel{font-size:.6em;color:#9c8f7e;text-transform:uppercase;letter-spacing:1.2px;font-weight:700;display:block;margin-bottom:3px}
  .q-meta-cell .mval{font-size:.88em;font-weight:700;color:#2d2416}
  /* PARTIES */
  .q-parties{display:flex;justify-content:space-between;align-items:flex-start;padding:16px 28px;border-bottom:1px solid #f1f5f9}
  .q-party-label{font-size:.6em;color:#94a3b8;text-transform:uppercase;letter-spacing:1.8px;font-weight:700;margin-bottom:5px}
  .q-customer-name{font-size:1.5em;font-weight:800;color:#0f172a;letter-spacing:-.3px}
  .q-contact{font-size:.8em;color:#64748b;margin-top:4px}
  .q-agency-wrap{text-align:right}
  .q-agency-name{font-size:1.2em;font-weight:800;color:#1a2b5e;letter-spacing:-.2px}
  .q-agency-sub{font-size:.76em;color:#64748b;margin-top:4px}
  /* INFO BOXES */
  .q-info-row{display:flex;background:#f8fafc;border-top:1px solid #e2e8f0;border-bottom:2px solid #1a2b5e}
  .q-info-box{flex:1;padding:11px 20px;border-right:1px solid #e2e8f0}
  .q-info-box:last-child{border-right:none}
  .q-info-label{display:block;font-size:.6em;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-bottom:4px}
  .q-info-val{font-size:.95em;font-weight:800;color:#1a2b5e}
  .q-info-sub{font-size:.75em;font-weight:500;color:#64748b}
  .q-veh-desc{padding:7px 28px;font-size:.76em;color:#64748b;background:#f8fafc;border-bottom:1px solid #e2e8f0}
  /* SECTION HEADING */
  .q-section-head{padding:14px 28px 8px}
  .sh-title{font-size:.68em;font-weight:900;letter-spacing:4px;text-transform:uppercase;color:#1a2b5e}
  .sh-bar{height:2.5px;width:56px;background:#f97316;margin-top:6px;border-radius:2px}
  /* MEMBER TABLE (Health) */
  .q-table{width:100%;border-collapse:collapse;font-size:.87em}
  .q-table thead tr{background:#1a2b5e}
  .q-table thead th{color:#fff;font-size:.72em;font-weight:700;letter-spacing:.8px;text-transform:uppercase;padding:9px 16px;white-space:nowrap}
  .q-table thead th.th-right{text-align:right}
  .q-table thead th.th-center{text-align:center}
  .q-table tbody tr:nth-child(odd){background:#f8fbff}
  .q-table tbody tr:nth-child(even){background:#fff}
  .q-table tbody tr.subtotal-row td{background:#eef4ff;font-weight:700;color:#1a2b5e;border-top:1px solid #c7d9f8}
  .q-table tbody tr.disc-row td{color:#059669}
  .q-table tbody tr.disc-row td.td-amt{font-weight:700;color:#dc2626}
  .q-table tbody td{padding:9px 16px;border-bottom:1px solid #f1f5f9}
  .q-table tbody td.td-name{font-weight:700;color:#0f172a}
  .q-table tbody td.td-center{text-align:center;color:#64748b}
  .q-table tbody td.td-disc{color:#f97316;font-weight:600}
  .q-table tbody td.td-right{text-align:right;font-weight:700;color:#1a2b5e}
  /* TWO-COL MOTOR */
  .q-two-col{display:grid;grid-template-columns:1fr 1fr;border-top:2px solid #1a2b5e;font-size:.87em}
  .q-single-col{border-top:2px solid #1a2b5e;font-size:.87em}
  .q-col-od{border-right:1px solid #cbd5e1}
  .col-head{background:#1a2b5e;color:#fff;padding:8px 14px;font-size:.72em;font-weight:800;letter-spacing:1.5px;text-transform:uppercase}
  .col-head-sub{font-size:.85em;font-weight:500;opacity:.7;letter-spacing:.5px}
  .q-col-table{width:100%;border-collapse:collapse}
  .q-col-table td{padding:7px 14px;border-bottom:1px solid #f1f5f9;font-size:.9em}
  .q-col-table td.val{text-align:right;font-variant-numeric:tabular-nums;min-width:80px;white-space:nowrap}
  .q-col-table tr.disc-row td{color:#059669}
  .q-col-table tr.net-row td{font-weight:800;background:#eef4ff;color:#1a2b5e;border-top:1px solid #c7d9f8}
  .q-col-table tr.sub-head td{background:#f1f5f9;color:#475569;font-size:.72em;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;padding:6px 14px}
  .val-sub{font-size:.82em;color:#94a3b8;font-weight:500}
  /* TOTAL BOX */
  .q-total-box{background:linear-gradient(135deg,#0d1b3e,#1a3060);display:flex;align-items:center;justify-content:space-between;margin:14px 0 0;padding:0}
  .q-total-left{padding:18px 28px}
  .q-total-main-lbl{color:#fff;font-size:.78em;font-weight:800;letter-spacing:2px;text-transform:uppercase}
  .q-total-sub{color:#f97316;font-size:.72em;font-weight:600;margin-top:5px}
  .q-total-right{padding:16px 28px;text-align:right}
  .q-total-amt{color:#fff;font-size:2.1em;font-weight:900;letter-spacing:-1px}
  .q-total-save{color:rgba(255,255,255,.5);font-size:.7em;margin-top:4px}
  /* COVERAGE */
  .q-coverage{padding:10px 28px 14px;display:flex;flex-wrap:wrap;gap:6px}
  .q-pill{display:inline-flex;align-items:center;gap:5px;background:#f8fafc;border:1px solid #e2e8f0;color:#1a2b5e;padding:5px 13px;border-radius:20px;font-size:.78em;font-weight:600}
  .q-pill::before{content:'✓';color:#059669;font-weight:800;font-size:.9em}
  /* NOTES */
  .q-notes{padding:10px 28px 12px;font-size:.68em;color:#64748b;line-height:1.9;border-top:1px solid #f1f5f9}
  /* FOOTER BAR */
  .q-footer-bar{background:#0d1b3e;color:rgba(255,255,255,.4);text-align:center;padding:9px;font-size:.67em;letter-spacing:.3px}
  @media print{
    body{background:#fff!important}
    .page{box-shadow:none!important;margin:0!important;max-width:100%!important}
    @page{size:A4 portrait;margin:1cm}
  }`;
}

// =============================================================================
// HEALTH QUOTATION — opens print window matching sample
// =============================================================================
function generatePDF() {
  if (!quoteResult) { alert('Please calculate premium first.'); return; }
  const qr = quoteResult;

  const agentName    = (document.getElementById('agentName')?.value||'').trim() || 'Agent';
  const agentCode    = (document.getElementById('agentCode')?.value||'').trim();
  const custName     = (document.getElementById('custName')?.value||'').trim()  || 'Valued Customer';
  const custContact  = (document.getElementById('custContact')?.value||'').trim();

  const today    = new Date();
  const validity = new Date(today); validity.setDate(validity.getDate()+30);
  const fmtD = dt => dt.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
  const cur  = n  => '₹'+Math.round(n).toLocaleString('en-IN');
  const seq  = String(today.getMonth()+1).padStart(2,'0')+String(today.getDate()).padStart(2,'0');
  const yr   = String(today.getFullYear()).slice(-2);
  const quoteRef = `NIA/SBL/H/${yr}-${seq}`;

  // Plan details
  const planLabel = qr.plan ? `${qr.plan} — Yuva Bharat` : 'NI Floater Mediclaim';
  const siLabel   = qr.siLabel || '—';
  const zoneLabel = qr.zoneLabel || '—';
  const termLabel = `${qr.term} Year${qr.term>1?'s':''} Annual`;
  const hasHP     = !!qr.plan && qr.memberRows.some(r=>(r.hpNet||0)!==0);
  const cols      = qr.plan ? 4 : 3; // member | age | [discount] | premium

  // Member table rows
  let memberRows = '';
  qr.memberRows.forEach((r,i)=>{
    const name = r.name||`Member ${i+1}`;
    const age  = r.age||'—';
    let discTxt = '—', discClass = '';
    if (qr.plan && hasHP) {
      const hp=r.hpNet||0;
      if (hp!==0){
        const amt=Math.abs(Math.round((r.base||0)*Math.abs(hp)/100));
        discTxt=`${hp<0?'-':'+'}${Math.abs(hp)}% (₹${amt.toLocaleString('en-IN')})`;
        discClass=hp<0?' td-disc':'';
      }
    }
    const netAmt = cur(r.afterHP!=null?r.afterHP:r.base);
    memberRows += `<tr>
      <td class="td-name">${name}</td>
      <td class="td-center">${age}</td>
      ${qr.plan?`<td class="${discClass||'td-dash'}">${discTxt}</td>`:''}
      <td class="td-right">${netAmt}</td>
    </tr>`;
  });

  // Summary rows
  let summaryRows = '';
  if (qr.plan) {
    if (qr.memberRows.length>1||qr.floaterDisc||qr.loyalty||qr.termDisc)
      summaryRows+=`<tr class="subtotal-row"><td colspan="${cols-1}">Sub-total · all members</td><td class="td-right">${cur(qr.subtotal)}</td></tr>`;
    if (qr.floaterDisc) {
      const n=qr.mems.length, p=Math.round(qr.floaterDisc*100);
      summaryRows+=`<tr class="disc-row"><td colspan="${cols-1}">Family Floater Discount · ${n} members  −${p}%</td><td class="td-right td-amt">−${cur(Math.round(qr.subtotal*qr.floaterDisc)).replace('₹','')}</td></tr>`;
    }
    if (qr.loyalty)
      summaryRows+=`<tr class="disc-row"><td colspan="${cols-1}">Loyalty Discount (−2.5%)</td><td class="td-right td-amt">−${cur(Math.round(qr.afterFloater*0.025)).replace('₹','')}</td></tr>`;
    if (qr.termDisc) {
      const p=Math.round(qr.termDisc*100);
      summaryRows+=`<tr class="disc-row"><td colspan="${cols-1}">Long-Term Discount (−${p}%) · ${qr.term} Years</td><td class="td-right td-amt">−${cur(Math.round(qr.afterLoyalty*qr.termDisc)).replace('₹','')}</td></tr>`;
    }
  } else {
    summaryRows+=`<tr class="subtotal-row"><td colspan="${cols-1}">Sub-total · all members</td><td class="td-right">${cur(qr.combined)}</td></tr>`;
    if (qr.floaterDisc) {
      const n=qr.mems.length, p=Math.round(qr.floaterDisc*100);
      summaryRows+=`<tr class="disc-row"><td colspan="${cols-1}">Family Floater Discount · ${n} members  −${p}%</td><td class="td-right td-amt">−${cur(Math.round(qr.combined*qr.floaterDisc)).replace('₹','')}</td></tr>`;
    }
  }

  const totalVal = qr.plan ? qr.grandTotal : qr.afterTerm;
  const savings  = qr.plan && qr.subtotal>totalVal ? (qr.subtotal-totalVal) : 0;

  // Coverage highlights
  const CH={
    Basic:   ['Inpatient Hospitalisation','Pre & Post Hospitalisation','Day Care Procedures','Emergency Ambulance','Domiciliary Treatment'],
    Gold:    ['Inpatient Hospitalisation','AYUSH Treatment','Organ Donor','Day Care Procedures','50% Cumulative Bonus'],
    Platinum:['Inpatient Hospitalisation','Maternity & Newborn Cover','AYUSH Treatment','Organ Donor','50% Cumulative Bonus'],
    nif:     ['Family Floater Cover','Inpatient Hospitalisation','Pre & Post Hospitalisation','Day Care Procedures','Ambulance Charges'],
  };
  const hl = qr.plan ? (CH[qr.plan]||CH.Basic) : CH.nif;
  const pillsHTML = hl.map(h=>`<span class="q-pill">${h}</span>`).join('');

  const notes = [
    '* GST Nil effective 22 Sept 2025 per IRDAI notification.',
    '* Health Parameter Discount applies to members aged 18+ under the Yuva Bharat plan.',
    '* Final premium subject to insurer underwriting, medical history and policy issuance.',
    '* This quotation does not constitute a contract of insurance.',
  ];

  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<title>Health Insurance Premium Quotation</title>
<style>${_printCSS()}</style>
</head><body>
<div class="page">
  <div class="q-header">
    <div class="q-logo-wrap">${_printBadgeSVG()}<div class="q-brand"><h1>The New India Assurance</h1><p>Sambhal &nbsp;&middot;&nbsp; UP 38 &nbsp;&middot;&nbsp; Agency Office</p></div></div>
    <div class="q-title-right"><div class="q-type">Health Insurance</div><div class="q-title">Premium Quotation</div></div>
  </div>
  <div class="q-meta">
    <div class="q-meta-cell"><span class="mlabel">Quote Ref</span><div class="mval">${quoteRef}</div></div>
    <div class="q-meta-cell"><span class="mlabel">Quote Date</span><div class="mval">${fmtD(today)}</div></div>
    <div class="q-meta-cell"><span class="mlabel">Valid Till</span><div class="mval">${fmtD(validity)}</div></div>
    <div class="q-meta-cell"><span class="mlabel">GST</span><div class="mval">NIL</div></div>
  </div>
  <div class="q-parties">
    <div>
      <div class="q-party-label">Prepared For</div>
      <div class="q-customer-name">${custName}</div>
      <div class="q-contact">Contact &mdash; ${custContact||'—'}</div>
    </div>
    <div class="q-agency-wrap">
      <div class="q-party-label">Prepared By</div>
      <div class="q-agency-name">Sambhal (UP 38) Agency</div>
      <div class="q-agency-sub">The New India Assurance Co. Ltd. &nbsp;&middot;&nbsp; IRDAI Reg. 190</div>
    </div>
  </div>
  <div class="q-info-row">
    <div class="q-info-box"><span class="q-info-label">Plan</span><div class="q-info-val">${planLabel}</div></div>
    <div class="q-info-box"><span class="q-info-label">Sum Insured</span><div class="q-info-val">${siLabel} <span class="q-info-sub">${qr.coverage==='floater'?'Floater':'Individual'}</span></div></div>
    <div class="q-info-box"><span class="q-info-label">Zone</span><div class="q-info-val">${zoneLabel}</div></div>
    <div class="q-info-box"><span class="q-info-label">Policy Term</span><div class="q-info-val">${termLabel}</div></div>
  </div>
  <div class="q-section-head"><div class="sh-title">Premium Breakdown</div><div class="sh-bar"></div></div>
  <table class="q-table">
    <thead><tr>
      <th style="text-align:left;width:38%">Member</th>
      <th class="th-center" style="width:12%">Age</th>
      ${qr.plan?'<th style="text-align:left;width:26%">Discount</th>':''}
      <th class="th-right" style="width:24%">Net Premium</th>
    </tr></thead>
    <tbody>${memberRows}${summaryRows}</tbody>
  </table>
  <div class="q-total-box">
    <div class="q-total-left">
      <div class="q-total-main-lbl">Total Annual Premium</div>
      <div class="q-total-sub">Inclusive of all discounts &nbsp;&middot;&nbsp; GST NIL</div>
    </div>
    <div class="q-total-right">
      <div class="q-total-amt">${cur(totalVal)}</div>
      <div class="q-total-save">per year${savings>0?` &nbsp;&middot;&nbsp; you save ${cur(savings)}<br>(vs individual pricing)`:''}</div>
    </div>
  </div>
  <div class="q-section-head" style="padding-top:12px"><div class="sh-title">Coverage Highlights</div><div class="sh-bar"></div></div>
  <div class="q-coverage">${pillsHTML}</div>
  <div class="q-notes">${notes.map(n=>`<div>${n}</div>`).join('')}</div>
  <div class="q-footer-bar">Computer-generated quotation &nbsp;&middot;&nbsp; The New India Assurance &mdash; Sambhal (UP 38) &nbsp;&middot;&nbsp; ${fmtD(today)}</div>
</div>
<script>window.onload=()=>setTimeout(()=>window.print(),600);<\/script>
</body></html>`;

  const w = window.open('','_blank','width=880,height=960');
  if (!w) { alert('Please allow popups to print the quotation.'); return; }
  w.document.write(html);
  w.document.close();
}

// =============================================================================
// =============================================================================
// MOTOR QUOTATION — buildPrintDoc opens print window matching sample
// =============================================================================
function buildPrintDoc_REMOVED_PLACEHOLDER() {
}

// =============================================================================
// INIT
// =============================================================================



