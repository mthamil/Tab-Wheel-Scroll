import gulp     from "gulp";
import del      from "del";
import jeditor  from "gulp-json-editor";
import babel    from "gulp-babel";
import moment   from "moment";
import { exec } from "child_process";

const config = {
    in: "src/",
    out: "dist/"
};

export const clean = done => 
    del([`${config.out}*`], done);

export const version = () =>
    gulp.src(`${config.in}package.json`, { base: `${config.in}` })
        .pipe(jeditor({
            "version": `${moment.utc().format("YYYYMMDD.H")}.0`
        }))
        .pipe(gulp.dest(config.out));

export const source = () =>
    gulp.src([`${config.in}**/*.js`], { base: `${config.in}` })
        .pipe(babel())
        .pipe(gulp.dest(config.out));

export const content = gulp.series(version, () =>
    gulp.src([`${config.in}**`, `!${config.in}package.json`, `!${config.in}**/*.js`], { base: `${config.in}` })
        .pipe(gulp.dest(config.out)));

export const build = gulp.series(clean, source, content, done => {
    exec(`${__dirname}/node_modules/.bin/jpm xpi`, { cwd: `${config.out}` }, (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        done(err);
    });
});

export default build;
