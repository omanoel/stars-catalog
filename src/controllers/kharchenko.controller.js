const fs = require('fs');

/*
-------------------------------------------------------------------------------
http://cdsarc.unistra.fr/ftp/I/280B/ReadMe
-------------------------------------------------------------------------------

1- 12  F12.9 h         RAhour   Right Ascension J2000.0, epoch 1991.25
14- 25  F12.8 deg       DEdeg    Declination J2000.0, epoch 1991.25
27- 30  I4   0.1mas   e_RAhour   Standard error in RA*cos(DEdeg)
32- 35  I4   0.1mas   e_DEdeg    Standard error in DEdeg
37- 42  I6  0.01mas     Plx     *?=999999 Trigonometric parallax
44- 48  I5  0.01mas   e_Plx     *?=99999 Standard error in Plx
50- 56  I7  0.01mas/yr  pmRA     Proper Motion in RA*cos(DE)
58- 64  I7  0.01mas/yr  pmDE     Proper Motion in Declination
66- 70  I5  0.01mas/yr e_pmRA    Standard error in pmRA
72- 76  I5  0.01mas/yr e_pmDE    Standard error in pmDE
78- 82  I5    mmag      Bmag    *?=99999 B magnitude in Johnson system
84- 88  I5    mmag      Vmag    *?=99999 V magnitude in Johnson system
90- 93  I4    mmag    e_Bmag    *?=9999 Standard error on Bmag
95- 98  I4    mmag    e_Vmag    *?=9999 Standard error on Vmag
100-103  I4    mmag      Scat    *?=9999 Scatter on V_T_ or Hp mag
   105  A1    ---       v1      *[GN ] Known variability from GCVS/NSV
   106  A1    ---       v2      *[UVW ] Variability from Tycho-1
   107  A1    ---       v3      *[CDMPRU ] Variability type
   108  A1    ---       v4      *[VYIXR ] Variability from CMC11
109-110  A2    ---       d12     *[A-S ] CCDM component identifier
   111  A1    ---       d3      *[A-S ] Component identifier
   112  A1    ---       d4      *[DRSYZ ] Duplicity from Tycho-1
   113  A1    ---       d5      *[CGOVX ] Double/Multiple Systems flag
   114  A1    ---       d6      *[D ] Duplicity flag from PPM
116-135  A20   ---       SpType  *Spectral type in MK or HD system
137-140  I4    ---       TYC1    *?=0 TYC1 number from Tycho-2
141-145  I5    ---       TYC2    *?=0 TYC2 number from Tycho-2
   146  I1    ---       TYC3    *?=0 TYC3 number from Tycho-2
148-153  I6    ---       HIP     *?=0 Hipparcos number
155-160  I6    ---       HD      *?=0 HD number
162-169  I8    ---       DM      *?=0 DM number
171-177  I7    ---       ASCC    *[1,2603318] ASCC-2.5 number
179-183  I5    mmag      Jmag    *?=99999 J magnitude from 2MASS
185-188  I4    mmag    e_Jmag    *?=9999 Standard error on J magnitude
190-194  I5    mmag      Hmag    *?=99999 H magnitude from 2MASS
196-199  I4    mmag    e_Hmag    *?=9999 Standard error on H magnitude
201-205  I5    mmag      Kmag    *?=99999 K_s magnitude from 2MASS
207-210  I4    mmag    e_Kmag    *?=9999 Standard error on K_s magnitude
-------------------------------------------------------------------------------
*/

const parserColums = [{
  key: 'ra',
  min: 1,
  max: 12
}, {
  key: 'dec',
  min: 14,
  max: 25
}, {
  key: 'era',
  min: 27,
  max: 30
}, {
  key: 'edec',
  min: 32,
  max: 35
}, {
  key: 'plx',
  min: 37,
  max: 42
}, {
  key: 'eplx',
  min: 44,
  max: 48
}, {
  key: 'pmra',
  min: 50,
  max: 56
}, {
  key: 'pmdec',
  min: 58,
  max: 64
}, {
  key: 'epmra',
  min: 66,
  max: 70
}, {
  key: 'epmdec',
  min: 72,
  max: 76
}, {
  key: 'bmag',
  min: 78,
  max: 82
}, {
  key: 'vmag',
  min: 84,
  max: 88
}, {
  key: 'ebmag',
  min: 90,
  max: 93
}, {
  key: 'evmag',
  min: 95,
  max: 98
}, {
  key: 'scat',
  min: 100,
  max: 103
}, {
  key: 'v1',
  min: 105,
  max: 105
}, {
  key: 'v2',
  min: 106,
  max: 106
}, {
  key: 'v3',
  min: 107,
  max: 107
}, {
  key: 'v4',
  min: 108,
  max: 108
}, {
  key: 'd12',
  min: 109,
  max: 110
}, {
  key: 'd3',
  min: 111,
  max: 111
}, {
  key: 'd4',
  min: 112,
  max: 112
}, {
  key: 'd5',
  min: 113,
  max: 113
}, {
  key: 'd6',
  min: 114,
  max: 114
}, {
  key: 'spect',
  min: 116,
  max: 135
}, {
  key: 'tyc1',
  min: 137,
  max: 140
}, {
  key: 'tyc2',
  min: 141,
  max: 145
}, {
  key: 'tyc3',
  min: 146,
  max: 146
}, {
  key: 'hip',
  min: 148,
  max: 153
}, {
  key: 'hd',
  min: 155,
  max: 160
}, {
  key: 'dm',
  min: 162,
  max: 169
}, {
  key: 'ascc',
  min: 171,
  max: 177
}, {
  key: 'jmag',
  min: 179,
  max: 183
}, {
  key: 'ejmag',
  min: 185,
  max: 188
}, {
  key: 'hmag',
  min: 190,
  max: 194
}, {
  key: 'ehmag',
  min: 196,
  max: 199
}, {
  key: 'jmag',
  min: 201,
  max: 205
}, {
  key: 'ejmag',
  min: 207,
  max: 210
}];

const keepColumns = ['ascc', 'ra', 'dec', 'plx', 'pmra', 'pmdec', 'spect', 'tyc1', 'tyc2', 'tyc3', 'hip', 'hd', 'dm', 'bmag', 'vmag'];

// Init
exports.getCsv = (req, res) => {
  // file
  const datFile = req.params.file;
  // Load dat file
  const starLines = fs
    .readFileSync('./datas/kharchenko/' + datFile)
    .toString()
    .split('\n');
  // -----------------------
  // console.log(starLines.length + ' loaded...');
  const aKeys = keepColumns; // starLines[0].split(',');
  // console.log(aKeys);

  const max = starLines.length;

  let aStars = '';

  for (let i = 0; i < max; i++) {
    const starLine = starLines[i];
    // console.log(starLine);
    let avoid = false;
    let aStar = '';
    if (starLine !== '') {
      aKeys.forEach((key, idx) => {
        const parserColum = parserColums.find(k => k.key === key);
        // console.log(parserColum);
        const value = starLine.substr(parserColum.min - 1, parserColum.max - parserColum.min + 1).trim();
        // console.log(value);
        if (key === 'plx' && value === '999999') {
          avoid = true;
        };
        aStar += '"' + value + '";';
      });
      aStar += '\n';
    }
    if (!avoid) {
      aStars += aStar;
    }

  }

  res.send(aStars);
};