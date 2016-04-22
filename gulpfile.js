const gulp = require("gulp");
const del = require("del");
const jeditor = require("gulp-json-editor");
const babel = require("gulp-babel");
const moment = require("moment");
const exec = require('child_process').exec;

const config = {
    in: "src/",
    out: "dist/"
};

gulp.task("clean", (done) => {
    del.sync([`${config.out}*`]);
    done();
});

gulp.task("version", () => {
    return gulp.src(`${config.in}package.json`, { base: `${config.in}` })
               .pipe(jeditor({
                    "version": `${moment.utc().format("YYYYMMDD.H")}.0`
                }))
               .pipe(gulp.dest(config.out));
});

gulp.task("source", () => {
    return gulp.src([`${config.in}**/*.js`], { base: `${config.in}` })
               .pipe(babel())
               .pipe(gulp.dest(config.out));
});

gulp.task("content", ["version"], () => {
    return gulp.src([`${config.in}**`, `!${config.in}package.json`, `!${config.in}**/*.js`], { base: `${config.in}` })
               .pipe(gulp.dest(config.out));
});

gulp.task("build", ["clean", "source", "content"], (done) => {
    exec(`${__dirname}/node_modules/.bin/jpm xpi`, { cwd: `${config.out}` }, (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        done(err);
    });
});
