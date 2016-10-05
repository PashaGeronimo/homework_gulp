var gulp = require('gulp');
var server = require('gulp-server-livereload');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');

var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');

const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

var clean = require('gulp-clean');




//server
gulp.task('start', function() {
    gulp.src('app')
        .pipe(server({
            livereload: true,
            open: true
        }))
});


//builder 
gulp.task('build', function() {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', csso()))
        .pipe(gulp.dest('build'));
});

//styles
gulp.task('styles', function() {
    gulp.src('app/sass/**/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(prefix({
            browsers: ['last 15 versions']
        }))
        .pipe(gulp.dest('app/css'))
});


//watcher отслеживает изменение sass
gulp.task('watch', function() {
    gulp.watch('app/sass/**/*.sass', ['styles']);
});


//default запускает и сервер и watch
gulp.task('default', ['start', 'watch']);


//сжатие картинок
gulp.task('img', function() {
    gulp.src('app/img/*')
        .pipe(imagemin({
            plugins: [
                imageminMozjpeg({ quality: '55' }),
                imageminPngquant({ quality: '55' })
            ]
        }))
        .pipe(gulp.dest('build/img'))
});



//удаление только фото
gulp.task('clean', function() {
    gulp.src(['app/img/*.jpg', 'app/img/*.png', 'app/img/*.gif'], { read: false })
        .pipe(clean());
});

//очистка build
gulp.task('cleanbuild', function() {
    gulp.src(['build/*'], { read: false })
        .pipe(clean());
});