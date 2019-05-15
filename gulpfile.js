let gulp = require("gulp");
let babel = require("gulp-babel");
let rename = require("gulp-rename");

function handleScripts(onError) {
    return gulp.src("src/model-viewer.js")
    .pipe(babel())
    .pipe(rename((path) => {
        path.basename += ".min";
    }))
    .pipe(gulp.dest("dist"));
    onError();
}

gulp.watch("src/model-viewer.js", handleScripts);

exports.default = handleScripts;