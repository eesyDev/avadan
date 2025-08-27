'use strict';

import gulp from 'gulp';
import prefixer from 'gulp-autoprefixer';
import uglify from 'gulp-uglify';
import dartSass from 'gulp-dart-sass';
import rigger from 'gulp-rigger';
import cleanCSS from 'gulp-clean-css';
import imagemin from 'gulp-imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import optipng from 'imagemin-optipng';
import svgSprite from 'gulp-svg-sprite';
import svgmin from 'gulp-svgmin';
import replace from 'gulp-replace';
import browserSync from 'browser-sync';
import sourcemaps from 'gulp-sourcemaps';
import { promises as fs } from 'fs';
import { parse } from 'node-html-parser';
import { createWriteStream, readdirSync, statSync, readFileSync } from 'fs';
import archiver from 'archiver';
import path from 'node:path';

const wpThemePath = 'wordpress/wp-content/themes/eesydev/';

const projectPaths = {
    build: {
        html: 'build/',
        js: 'build/assets/js/',
        css: 'build/assets/css/',
        img: 'build/assets/img/',
        svg: 'build/assets/img/',
        fonts: 'build/assets/fonts/',
        lib: 'build/assets/lib/',
        php: 'build/assets/php/',
        video: 'build/assets/video/',
    },
    wp: {
        js: wpThemePath + 'assets/js/',
        css: wpThemePath + 'assets/css/',
        img: wpThemePath + 'assets/img/',
        fonts: wpThemePath + 'assets/fonts/',
        lib: wpThemePath + 'assets/lib/',
        php: wpThemePath + 'assets/php/',
        video: wpThemePath + 'assets/video/',
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/*.js',
        style: 'src/scss/style.scss',
        img: 'src/img/**/*.*',
        svg: 'src/img/svg/**/*.svg',
        fonts: 'src/fonts/**/*.*',
        lib: 'src/lib/**/*.*',
        php: 'src/php/**/*.*',
        video: 'src/video/**/*.*',
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/scss/**/*.scss',
        img: 'src/img/**/*.*',
        svg: 'src/img/svg/**/*.svg',
        fonts: 'src/fonts/**/*.*',
        lib: 'src/lib/**/*.*',
        php: 'src/php/**/*.*',
        video: 'src/video/**/*.*',
    },
    clean: './build',
    cleanwp: wpThemePath + 'assets'
};

// Задача очистки директорий
gulp.task('clean', async function () {
    await Promise.all([
        fs.rm(projectPaths.clean, { recursive: true, force: true }),
        fs.rm(projectPaths.cleanwp, { recursive: true, force: true }),
    ]);
});

// Задачи сборки

gulp.task('html:build', async function () {
    return gulp.src(projectPaths.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(projectPaths.build.html))
        .pipe(browserSync.stream());
});

gulp.task('js:build', async function () {
    return gulp.src(projectPaths.src.js)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(projectPaths.build.js))
        .pipe(gulp.dest(projectPaths.wp.js))
        .pipe(browserSync.stream());
});

gulp.task('style:build', async function () {
    return gulp.src(projectPaths.src.style)
        .pipe(sourcemaps.init())
        .pipe(dartSass().on('error', dartSass.logError))
        .pipe(prefixer())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(projectPaths.build.css))
        .pipe(gulp.dest(projectPaths.wp.css))
        .pipe(browserSync.stream());
});

gulp.task('image:build', async function () {
    return gulp.src(projectPaths.src.img, { encoding: false })
        .pipe(imagemin([
            mozjpeg({ quality: 75, progressive: true }),
            optipng({ optimizationLevel: 5 }),
        ]))
        .pipe(gulp.dest(projectPaths.build.img))
        .pipe(gulp.dest(projectPaths.wp.img));
});

// gulp.task('svg:build', async function () {
//     return gulp.src(projectPaths.src.svg)
//         .pipe(svgmin({ js2svg: { pretty: true } }))
//         .on('data', (file) => {
//             if (file.isBuffer()) {
//                 const content = file.contents.toString();
//                 const root = parse(content);
//                 root.querySelectorAll('[fill]').forEach((el) => el.removeAttribute('fill'));
//                 root.querySelectorAll('[stroke]').forEach((el) => el.removeAttribute('stroke'));
//                 root.querySelectorAll('[style]').forEach((el) => el.removeAttribute('style'));
//                 file.contents = Buffer.from(root.toString());
//             }
//         })
//         .pipe(replace('&gt;', '>'))
//         .pipe(svgSprite({
//             mode: {
//                 symbol: {
//                     sprite: '../sprite.svg',
//                 },
//             },
//         }))
//         .pipe(gulp.dest(projectPaths.build.img))
//         .pipe(gulp.dest(projectPaths.wp.img));
// });

gulp.task('svg:build', async function () {
    return gulp.src(projectPaths.src.svg)
        .pipe(svgmin({
            js2svg: { pretty: true },
            plugins: [
                {
                    name: 'removeAttrs',
                    params: {
                        attrs: ['class', 'data-name', 'fill', 'stroke']
                    }
                }
            ]
        }))
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: 'sprite.svg',
                }
            }
        }))
        .pipe(gulp.dest(projectPaths.build.img))
        .pipe(gulp.dest(projectPaths.wp.img));
});

gulp.task('fonts:build', async function () {
    return gulp.src(projectPaths.src.fonts)
        .pipe(gulp.dest(projectPaths.build.fonts))
        .pipe(gulp.dest(projectPaths.wp.fonts));
});

gulp.task('lib:build', async function () {
    return gulp.src(projectPaths.src.lib)
        .pipe(gulp.dest(projectPaths.build.lib))
        .pipe(gulp.dest(projectPaths.wp.lib));
});

gulp.task('php:build', async function () {
    return gulp.src(projectPaths.src.php)
        .pipe(gulp.dest(projectPaths.build.php))
        .pipe(gulp.dest(projectPaths.wp.php));
});

gulp.task('video:build', async function () {
    return gulp.src(projectPaths.src.video, { encoding: false })
        .pipe(gulp.dest(projectPaths.build.video))
        .pipe(gulp.dest(projectPaths.wp.video));
});

// Общие задачи

gulp.task('build', gulp.series(
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build',
    'svg:build',
    'lib:build',
    'php:build',
    'video:build'
));

const watchTasks = [
    { path: projectPaths.watch.html, task: 'html:build' },
    { path: projectPaths.watch.style, task: 'style:build' },
    { path: projectPaths.watch.js, task: 'js:build' },
    { path: projectPaths.watch.img, task: 'image:build' },
    { path: projectPaths.watch.svg, task: 'svg:build' },
    { path: projectPaths.watch.fonts, task: 'fonts:build' },
    { path: projectPaths.watch.lib, task: 'lib:build' },
    { path: projectPaths.watch.php, task: 'php:build' },
    { path: projectPaths.watch.video, task: 'video:build' },
];

const delay = 500;

gulp.task('watch', async function () {
    watchTasks.forEach(({ path, task }) => {
        gulp.watch(path, { delay: delay }, gulp.series(task));
    });
});

gulp.task('webserver', async function () {
    browserSync({
        server: { baseDir: "./build" },
        host: 'localhost',
        port: 8080,
        open: false,
        logLevel: "info",
        notify: false,
        reloadDebounce: delay,
    });
});

gulp.task('default', gulp.series('build', gulp.parallel('webserver', 'watch')));

// Архивация
gulp.task('zip', async function (done) {
    const output = createWriteStream('./build.zip');
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', (err) => {
        throw err;
    });

    archive.pipe(output);

    // Исключаем .map файлы и строки
    const addFilesToArchive = (dirPath) => {
        const files = readdirSync(dirPath);
        const version = Date.now();

        files.forEach((file) => {
            const fullPath = path.join(dirPath, file);
            const stats = statSync(fullPath);

            if (stats.isDirectory()) {
                addFilesToArchive(fullPath);
            } else {
                if (!fullPath.endsWith('.map')) {
                    let fileContent;
                    if (fullPath.match(/\.(jpg|jpeg|png|gif|mp4|webm|svg|bmp|avi|mov)$/)) {
                        fileContent = readFileSync(fullPath);
                    } else {
                        fileContent = readFileSync(fullPath, 'utf8');
                        fileContent = fileContent.replace(/\/\*# sourceMappingURL=.*\.map \*\//g, '');
                        fileContent = fileContent.replace(/\/\/# sourceMappingURL=.*\.map/g, '');

                        if (fullPath.endsWith('.html')) {
                            fileContent = fileContent.replace(/{{version}}/g, version.toString());
                        }
                    }

                    archive.append(fileContent, { name: path.relative('build', fullPath) });
                }
            }
        });
    };

    addFilesToArchive('build');

    const robotsContent = `
User-agent: *
Disallow: /
    `.trim();
    archive.append(robotsContent, { name: 'robots.txt' });

    await archive.finalize();

    output.on('close', done);
});