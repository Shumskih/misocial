'use strict';
var gulp = require('gulp'), //есть

	concat = require('gulp-concat'), //есть
	uglify = require('gulp-uglify-es').default,
	rename = require('gulp-rename'), //есть
	del = require('del'), //есть
	cache = require('gulp-cache'), //есть
	rigger = require('gulp-rigger'), //нет    
	sass = require('gulp-sass'), //есть
	sourcemaps = require('gulp-sourcemaps'), //нет
	//cssmin      = require('gulp-minify-css'),      //есть   старый
	cssnano = require('gulp-cssnano'), //есть
	imagemin = require('gulp-imagemin'), //есть
	pngquant = require('imagemin-pngquant'), //есть   
	//spritesmith = require('gulp.spritesmith'),   //нет
	plumber = require('gulp-plumber'), //есть
	autoprefixer = require('gulp-autoprefixer'),
	copy = require('gulp-contrib-copy'),
	browserSync = require('browser-sync');

let path = {
	js: 'src/js/*.js',
	js_build: 'dist/js',

	scripts: ['src/js/**/*.js'],
	scripts_build: '',

	css: ['src/assets/sass/*.sass', '!src/assets/_media.sass', '!src/assets/_fonts.sass', '!node_modules/**/*.sass'],
	css_build: ['dist/assets/css/'],

	img: 'src/assets/img/**/*',
	img_build: 'dist/assets/img',

	html: 'src/**/*.html',
	html_build: 'dist',

	fonts: 'src/assets/fonts/**/*',
	fonts_build: 'dist/assets/fonts'
};

// Local Server
gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: 'dist'
		},
		notify: false,
		// proxy: "prostitutkikieva.test/",
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	});
});

gulp.task('code:build', function (done) {
	gulp.src(path.html)
		.pipe(gulp.dest(path.html_build))
		.pipe(browserSync.stream());

	done();
});

gulp.task('fonts:copy', function (done) {
	gulp.src(path.fonts)
		.pipe(gulp.dest(path.fonts_build))
		.pipe(browserSync.stream());

	done();
});

gulp.task('js:build', function (done) {
	gulp.src(path.js) // Найдем наш main файл         
		// .pipe(plumber())
		.pipe(rigger()) // Прогоним через rigger
		.pipe(concat('main.js'))
		.pipe(sourcemaps.init()) // Инициализируем sourcemap
		.pipe(uglify()) // Сожмем наш js
		.pipe(sourcemaps.write()) // Пропишем карты
		// .pipe(plumber.stop())
		.pipe(gulp.dest(path.js_build))
		.pipe(browserSync.stream()); // Выплюнем готовый файл в build

	done();
});

gulp.task('scripts', function (done) {
	return gulp.src(path.scripts)
		.pipe(plumber())
		.pipe(rigger()) // Прогоним через rigger
		.pipe(uglify()) // Сожмем наш js
		.pipe(plumber.stop())
		.pipe(gulp.dest(path.scripts_build)); // Выплюнем готовый файл в build
});


gulp.task('css:build', function (done) {
	gulp.src(path.css) // Выберем наш main.scss         
		.pipe(plumber())
		.pipe(sourcemaps.init()) // То же самое что и с js
		.pipe(sass()) // Скомпилируем         
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
			cascade: true
		}))
		.pipe(cssnano()) // Сожмем         
		.pipe(sourcemaps.write()) // Пропишем карты
		.pipe(plumber.stop())
		.pipe(gulp.dest(path.css_build)) // И в build
		.pipe(browserSync.stream());

	done();
});


gulp.task('img:build', function () {
	return gulp.src(path.img) // Берем все изображения из app
		.pipe(cache(imagemin({ // С кешированием
			interlaced: true,
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false
			}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest(path.img_build)); // Выгружаем на продакшен
});

gulp.task('clear', function (callback) {
	return cache.clearAll();
});

gulp.task('watch', function () {
	gulp.watch(path.css, gulp.parallel('css:build'));
	gulp.watch(path.img, gulp.parallel('img:build'));
	gulp.watch(path.js, gulp.parallel('js:build'));
	gulp.watch(path.html, gulp.parallel('code:build'));
	gulp.watch(path.html, gulp.parallel('fonts:copy'));
});

gulp.task('default', gulp.parallel('watch', 'css:build', 'code:build', 'img:build', 'js:build', 'fonts:copy', 'browser-sync'));