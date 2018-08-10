var     gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		sass           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
        sourcemaps     = require('gulp-sourcemaps'),
		uglify         = require('gulp-uglify'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		del            = require('del'),
		imagemin       = require('gulp-imagemin'),
		cache          = require('gulp-cache'),
		autoprefixer   = require('gulp-autoprefixer'),
		bourbon        = require('node-bourbon'),
		ftp            = require('vinyl-ftp'),
		notify         = require('gulp-notify'),
    	babel          = require('gulp-babel');

// Скрипты проекта
gulp.task('scripts', function() {
	return gulp.src([
        'app/libs/jquery-3.3.1/jquery-3.3.1.min.js',
        'app/libs/jq-accordion/jq-accordion.js',
        'app/libs/tooltipster/dist/js/tooltipster.bundle.min.js',
        'app/libs/gsap/src/minified/TweenMax.min.js',
        'app/libs/scrollmagic/scrollmagic/minified/ScrollMagic.min.js',
        'app/libs/scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js',
        'app/libs/gsap/src/minified/plugins/ScrollToPlugin.min.js',
        'app/libs/gsap/src/minified/plugins/DrawSVGPlugin.min.js',
        'app/libs/jq-ui/jq-ui.js',
        'app/libs/jq-clipthru/jq-clipthru.js',
        'app/libs/scrollr/scrollr.js',
		'app/libs/slick/slick.min.js',
        'app/js/js2015.js',
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
        ghostMode: false
	});
});

gulp.task('babel', () =>
    gulp.src('app/js/main.js')
        .pipe(babel({presets: ['env']}))
        .pipe(concat('js2015.js'))
        .pipe(gulp.dest('app/js'))
);

gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sourcemaps.init())
	.pipe(sass({
		includePaths: bourbon.includePaths
	}).on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleanCSS())
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['sass', 'babel', 'scripts', 'browser-sync'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('app/js/main.js', ['babel']);
	gulp.watch(['libs/**/*.js', 'app/js/main.js'], ['scripts']);
	gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img')); 
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'babel', 'scripts'], function() {

	var buildFiles = gulp.src([
		'app/*.html',
		'app/.htaccess'
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'app/css/*.css'
		]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'app/js/scripts.min.js'
		]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'app/fonts/**/*']
		).pipe(gulp.dest('dist/fonts'));
});

gulp.task('deploy', function() {
	var conn = ftp.create({
		host:      'hostname.com',
		user:      'username',
		password:  'userpassword',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
	'dist/**',
	'dist/.htaccess',
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/path/to/folder/on/server'));

});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
