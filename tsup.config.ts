import { defineConfig } from 'tsup';
// @ts-ignore
import fs from 'fs';
// @ts-ignore
import path from "path";

// @ts-ignore
export default defineConfig({
    entry: [
        'src/**/*.ts',
        'src/**/*.tsx',
        'src/**/*.d.ts',
    ],
    outDir: './dist',
    format: ['esm'],
    target: 'ESNext',
    platform: 'node',
    bundle: false,
    splitting: false,
    sourcemap: false,
    clean: true,
    minify: false,
    dts: false,
    outExtension: () => ({ js: '.js' }),
    esbuildOptions: (options) => {
        options.resolveExtensions = ['.ts', '.js', '.tsx', '.jsx', '.mjs'];
    },
    tsconfig: './tsconfig.json',
    // @ts-ignore
    onSuccess: () => {
        try {
            const jsonDest = './dist/package.json';
            const envDest = './dist/.env';

            // @ts-ignore
            function fixImports(dir: string) {
                // Пропускаем node_modules если она существует
                if (path.basename(dir) === 'node_modules') {
                    return;
                }

                const files = fs.readdirSync(dir);

                for (const file of files) {
                    const filePath = path.join(dir, file);

                    try {
                        const stat = fs.statSync(filePath);

                        if (stat.isDirectory()) {
                            // Рекурсивно обходим только если это не node_modules
                            if (file !== 'node_modules') {
                                fixImports(filePath);
                            }
                        } else if (file.endsWith('.js')) {
                            let content = fs.readFileSync(filePath, 'utf8');

                            // Регулярное выражение для поиска импортов без .js
                            const importRegex = /from\s+['"](\.\.?\/[^'"]*?(?<!\.js))['"]/g;

                            content = content.replace(importRegex, (match: any, importPath: string) => {
                                // Пропускаем импорты пакетов из node_modules
                                if (!importPath.startsWith('./') && !importPath.startsWith('../')) {
                                    return match;
                                }
                                // Добавляем .js к относительным импортам
                                return `from '${importPath}.js'`;
                            });

                            fs.writeFileSync(filePath, content);
                        }
                    } catch (error) {
                        // Игнорируем ошибки доступа к файлам
                        // @ts-ignore
                        if (error.code !== 'ENOENT') {
                            // @ts-ignore
                            console.log(`⚠️ Ошибка при обработке ${filePath}:`, error.message);
                        }
                    }
                }
            }

            fixImports('./dist');
            console.log('✅ Выставлены абсолютные импорты...');

            // Копируем и модифицируем .env файл
            if (fs.existsSync('./.env')) {
                let envContent = fs.readFileSync('./.env', 'utf8');

                envContent = envContent
                    .replace(/NODE_ENV=.*/, 'NODE_ENV=production')
                fs.writeFileSync(envDest, envContent);
                console.log('✅ .env настроен на "production"...');
            }

            // Читаем package.json из backend
            const backendPackageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

            // Создаем package.json для dist только с dependencies
            const distPackageJson = {
                name: backendPackageJson.name,
                version: backendPackageJson.version,
                type: backendPackageJson.type,
                dependencies: backendPackageJson.dependencies,
                author: backendPackageJson.author,
                main: 'App.js',
                scripts: {
                    start: "node App.js"
                }
            };

            fs.writeFileSync(
                jsonDest,
                JSON.stringify(distPackageJson, null, 2)
            );
            console.log('✅ package.json создан...');

        } catch (error) {
            // @ts-ignore
            console.log('⚠️ Ошибка:', error.message);
        }
    }
});