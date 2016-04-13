const gulp = require("gulp");
const del = require("del");
const jeditor = require("gulp-json-editor");
const exec = require('child_process').exec;

const config = {
    in: "src/",
    out: "dist/",
    date: new Date()
};

gulp.task("clean", (done) => {
    del.sync([`${config.out}*`]);
    done();
});

gulp.task("version", () => {
    return gulp.src(`${config.in}package.json`, { base: `${config.in}` })
               .pipe(jeditor({
                    "version": `${config.date.getFullYear()}${config.date.getMonth()}${config.date.getDate()}.${config.date.getHours()}`
                }))
               .pipe(gulp.dest(config.out));
});

gulp.task("source", ["version"], () => {
    return gulp.src([`${config.in}**`, `!${config.in}package.json`], { base: `${config.in}` })
               .pipe(gulp.dest(config.out));
});

gulp.task("build", ["clean", "source"], (done) => {
    exec(`${__dirname}/node_modules/.bin/jpm xpi`, { cwd: `${config.out}` }, (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        done(err);
    });
});
