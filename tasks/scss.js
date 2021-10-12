import h from './helpers/helpers.js';
const {
		lastRun, notify,
		config: { paths },
		modules: {
			gulp: { src, dest },
			reload, stream, $if, sourcemaps, sass, prefixer
		}
	} = h;

export default function scss() {
	const { dev, mode } = h;
	return src(paths.src.scss, lastRun(scss)) // main файл
		.pipe($if(dev, sourcemaps.init())) // Инициализируем sourcemap
		.pipe(sass({
			outputStyle: 'compressed', // минимиация файла
			sourcemaps: dev
		}).on('error', sass.logError))
		.pipe(prefixer({
			browsers: ['> 1%'], // last 5 versions
			cascade: false, // запрет на разворот кода
			remove: true // удаление лишних стилей при обработке
		}))
		.pipe($if(dev, sourcemaps.write('.'))) // Пропишем карты
		.pipe(dest(paths.build.css)) // готовый файл min в build
		.pipe(notify(`${mode}:scss`));
		//.pipe(reload({ stream: true })); // И перезагрузим сервер
		//.pipe(stream());
}
