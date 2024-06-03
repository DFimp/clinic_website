const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const php = require('gulp-connect-php');

let autoprefixer;
let imagemin;
let imageminMozjpeg;
let imageminPngquant;

async function loadAutoprefixer() {
    const module = await import('gulp-autoprefixer');
    autoprefixer = module.default;
}

async function loadImagemin() {
    const imageminModule = await import('gulp-imagemin');
    const imageminMozjpegModule = await import('imagemin-mozjpeg');
    const imageminPngquantModule = await import('imagemin-pngquant');

    imagemin = imageminModule.default;
    imageminMozjpeg = imageminMozjpegModule.default;
    imageminPngquant = imageminPngquantModule.default;
}

gulp.task('fonts', () => {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
        .pipe(browserSync.stream());
});

async function styles() {
    if (!autoprefixer) {
        await loadAutoprefixer();
    }
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
}

gulp.task('scripts', () => {
    return gulp.src('src/js/**/*.js')
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});

gulp.task('html', () => {
    return gulp.src('src/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

gulp.task('images', async () => {
    if (!imagemin) {
        await loadImagemin();
    }
    return gulp.src('src/images/**/*')
        .pipe(imagemin([
            imageminMozjpeg(),
            imageminPngquant()
        ]))
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.stream());
});

gulp.task('php', () => {
    return gulp.src('src/*.php')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

gulp.task('config', () => {
    return gulp.src('config.php', { allowEmpty: true })
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

gulp.task('composer', () => {
    return gulp.src('vendor/**/*')
        .pipe(gulp.dest('dist/vendor'))
        .pipe(browserSync.stream());
});

gulp.task('serve', () => {
    php.server({ base: 'dist', port: 8010, keepalive: true }, () => {
        browserSync.init({
            proxy: '127.0.0.1:8010',
            baseDir: 'dist',
            open: true,
            notify: false
        });
    });

    gulp.watch('src/scss/**/*.scss', gulp.series(styles));
    gulp.watch('src/js/**/*.js', gulp.series('scripts'));
    gulp.watch('src/*.html', gulp.series('html'));
    gulp.watch('src/images/**/*', gulp.series('images'));
    gulp.watch('src/*.php', gulp.series('php'));
    gulp.watch('config.php', gulp.series('config'));
    gulp.watch('vendor/**/*', gulp.series('composer'));
    gulp.watch('src/fonts/**/*', gulp.series('fonts'));
    gulp.watch('dist/*.html').on('change', browserSync.reload);
    gulp.watch('dist/*.php').on('change', browserSync.reload);
});

gulp.task('default', gulp.series(styles, 'scripts', 'html', 'images', 'php', 'config', 'composer', 'fonts','serve'));

