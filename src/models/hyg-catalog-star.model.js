module.exports = mongoose => {

  const hygCatalogStarSchema = mongoose.Schema({
    id: String,
    x: Number,
    y: Number,
    z: Number,
    ra: Number,
    dec: Number,
    dist: Number,
    // velocity
    vx: Number,
    vy: Number,
    vz: Number,
    // labels
    hip: String,
    hd: String,
    hr: String,
    gl: String,
    bf: String,
    proper: String,
    // proper motion
    pmra: Number,
    pmdec: Number,
    rv: Number,
    // Magnitudes
    mag: Number,
    absmag: Number,
    spect: String,
    ci: Number,
    // positions and proper motions in rad
    rarad: Number,
    decrad: Number,
    pmrarad: Number,
    pmdecrad: Number,
    // Other labels
    bayer: String,
    flam: String,
    // Constellation
    con: String,
    comp: Number,
    comp_primary: Number,
    base: String,
    var: String,
    var_min: String,
    var_max: String
  })

  hygCatalogStarSchema.method("toJSON", function () {
    const {
      __v,
      _id,
      ...object
    } = this.toObject();
    object.idDb = _id;
    return object;
  });

  const HygCatalogStar = mongoose.model(
    "hygcatalogstar", hygCatalogStarSchema
  );

  return HygCatalogStar;
};