import gulp    from "gulp";
import gutil   from "gulp-util";
import del     from "del";
import jeditor from "gulp-json-editor";
import babel   from "gulp-babel";
import moment  from "moment";
import utils   from "jpm/lib/utils";
import xpi     from "jpm/lib/xpi";
import path    from "path";

const config = {
    in: "src/",
    out: "dist/"
};

export const clean = done => 
    del([`${config.out}*`], done);

export const version = () =>
    gulp.src(`${config.in}package.json`, { base: `${config.in}` })
        .pipe(jeditor({
            "version": `${moment.utc().format("YYYYMMDD.H.m")}`
        }))
        .pipe(gulp.dest(config.out));

export const source = () =>
    gulp.src([`${config.in}**/*.js`], { base: `${config.in}` })
        .pipe(babel())
        .pipe(gulp.dest(config.out));

export const content = gulp.series(version, () =>
    gulp.src([`${config.in}**`, `!${config.in}package.json`, `!${config.in}**/*.js`], { base: `${config.in}` })
        .pipe(gulp.dest(config.out)));

const jpmConfig = { addonDir: path.join(__dirname, config.out) };
export const build = gulp.series(clean, source, content, () =>
    utils.getManifest(jpmConfig)
         .then(manifest => { manifest.name = null; return manifest; })  // hack, clear name to produce desired xpi name
         .then(manifest => xpi(manifest, jpmConfig))
         .then(packagePath => gutil.log("Built addon package", packagePath)));

export default build;
