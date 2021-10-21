import h from './helpers/helpers.js';
const {
	lastRun, notify,
	config: { paths },
	modules: {
		gulp: { src, dest },
		$reload, stream, sourcemaps, sass, prefixer
	}
} = h;

export default function dev_scss() {
	return src(paths.src.scss, lastRun(dev_scss)) // main файл
		.pipe(sourcemaps.init()) // Инициализируем sourcemap
		.pipe(sass({
			outputStyle: 'compressed', // минимиация файла
			sourcemaps: true
		}).on('error', sass.logError))
		.pipe(prefixer({
			browsers: ['> 1%'], // last 5 versions
			cascade: false, // запрет на разворот кода
			remove: true // удаление лишних стилей при обработке
		}))
		.pipe(sourcemaps.write('.')) // Пропишем карты
		.pipe(dest(paths.build.css)) // готовый файл min в build
		.pipe(notify('dev:scss'));
		//.pipe($reload({ stream: true })); // И перезагрузим сервер
		//.pipe(stream());
}
