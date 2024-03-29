## Статьи про Gulp

* Знакомство с [Gulp](https://only-to-top.ru/blog/tools/2018-06-15-gulp-dlya-uskoreniya-razrabotki.html) (1 часть).
* Использование [SASS в Gulp](https://only-to-top.ru/blog/tools/2018-05-12-chto-takoe-sass-i-kak-ego-ispolzovat.html) проекте (2 часть).
* Автоматическое [обновление страницы в Gulp](https://only-to-top.ru/blog/tools/2018-05-25-avtomaticheskoe-obnovlenie-stranicy-s-pomoshhyu-browser-sync-dlya-gulp.html) (3 часть).
* [Babel](https://only-to-top.ru/blog/tools/2019-10-20-gulp-babel.html) для Gulp (4 часть).
* [Gulp-rsync](https://only-to-top.ru/blog/tools/2018-06-17-gulp-rsync-dlya-windows-10.html) (5 часть - текущая).

## Настройка SSH в Windows 10

Первое с чего стоит начать, это узнать поддерживает ли хостинг `SSH доступ`. Далее нужно включить его самому или попросить техподдержку хостинга включить доступ по SSH.
Настроим беспарольный доступ к хостингу с помощью `ключей доступа`, чтобы не вводить пароль каждый раз.
Мы сгенерируем два ключа: `открытый` ключ (публичный) и `закрытый` (приватный). Открытый ключ скопируем на сервер (хостинг), приватный останется только у вас на компьютере.

### Генерация ключей на вашем устройстве

Теперь нам понадобится оболочка [bash](https://only-to-top.ru/blog/windows/2018-05-27-ustanovka-bash-v-windows-10.html). Откроем bash. Терминал будет со значком доллара.

Создадим папку для хранения ключей доступа `.ssh`. Для этого введём команду</p>

```bash
mkdir -p ~/.ssh
```

Установим необходимые права доступа на неё

```bash
chmod 700 ~/.ssh
```

Перейдём в папку `.ssh`

```bash
cd ~/.ssh
```

Сгенерируем ключи доступа `id_rsa` (приватный) и `id_rsa.pub<` (публичный). Несколько раз нужно будет нажать клавишу `enter`

```bash
ssh-keygen
```

### Сохранение `id_rsa` на хостинге

Сохраним, сгенерированный в предыдущем пункте `приватный ключ` на хостинге:</p>

```bash
scp -p ~/.ssh/id_rsa.pub логин@IP-адрес_сервера:~
```

### Создание ключей авторизации на хостинге

Заходим по SSH:

```bash
ssh логин@IP-адрес_сервера
```

Вводите пароль.

*Если возникнет ошибка, возможно вам необходимо включить SSH-доступ на хостинге.*

Создадим папку `.ssh`

```bash
mkdir -p ~/.ssh
```

Установим права `700`.

```bash
chmod 700 ~/.ssh
```

Добавим наш ключ в `authorized_keys`.

```bash
cat id_rsa.pub >> ~/.ssh/authorized_keys
```

Установим права 600.

```bash
chmod 600 ~/.ssh/authorized_keys
```

### Удаление `id_rsa.pub` на хостинге

Теперь удалим публичный ключ на хостинге, т.к. мы его добавили в файл `authorized_keys`.

```bash
rm -f ~/id_rsa.pub
```

Завершаем сессию.

```bash
logout
```

### Добавление `id_rsa` на ваше устройство

Запустим `ssh-agent`

```bash
eval `ssh-agent -s`
```

Теперь добавим `id_rsa` (закрытый ключ) в `ssh-agent`

```bash
ssh-add ~/.ssh/id_rsa
```

Настройка беспарольного доступа завершена. Проверим rsync в действии.

Откроем `bash` в папке проекта и запустим деплой командой.

```bash
gulp deploy
```
