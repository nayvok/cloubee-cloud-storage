import {
    BookText,
    File,
    FileArchive,
    FileBox,
    FileCode2,
    FileCog,
    FileDigit,
    FileDown,
    FileImage,
    FileMusic,
    FileText,
    FileVideo2,
    Folder,
    type LucideIcon,
    PaintbrushVertical,
} from 'lucide-react';

export type FileIconCategory = {
    icon: LucideIcon;
    mime?: string[];
    extensions?: string[];
};

export const FILE_ICON_CONFIG: Record<string, FileIconCategory> = {
    /** Folders/directories */
    folder: {
        icon: Folder,
    },

    /** Programming languages and source files */
    code: {
        mime: [
            'text/javascript',
            'application/json',
            'text/x-csharp',
            'text/x-java',
            'text/x-python',
            'text/x-php',
            'text/x-ruby',
            'text/x-rust',
            'text/x-swift',
            'text/x-go',
            'text/x-shellscript',
            'text/x-lua',
            'text/x-perl',
            'text/x-kotlin',
            'text/x-dart',
            'text/x-haskell',
            'text/x-scala',
            'text/x-elixir',
            'text/x-clojure',
            'text/x-typescript',
            'text/x-dockerfile',
            'text/x-terraform',
            'text/html',
            'text/css',
            'application/xml',
        ],
        extensions: [
            '.dockerfile',
            '.dockerignore',
            '.tf',
            '.nomad',
            '.hcl',
            '.js',
            '.ts',
            '.jsx',
            '.tsx',
            '.py',
            '.rb',
            '.php',
            '.java',
            '.cpp',
            '.cs',
            '.go',
            '.rs',
            '.kt',
            '.dart',
            '.scala',
            '.sh',
            '.bash',
            '.zsh',
            '.ps1',
            '.bat',
            '.cmd',
            '.html',
            '.css',
            '.scss',
            '.sass',
            '.less',
            '.vue',
            '.svelte',
        ],
        icon: FileCode2,
    },

    /** Plain text documents */
    text: {
        mime: ['text/plain'],
        extensions: ['.txt', '.md', '.log', '.rst', '.tex'],
        icon: FileText,
    },

    /** Audio files */
    audio: {
        mime: ['audio/*'],
        extensions: [
            '.mp3',
            '.wav',
            '.ogg',
            '.flac',
            '.aac',
            '.wma',
            '.m4a',
            '.opus',
            '.ac3',
            '.amr',
            '.aiff',
            '.mid',
            '.midi',
            '.weba',
        ],
        icon: FileMusic,
    },

    /** Video files */
    video: {
        mime: ['video/*'],
        extensions: [
            '.mp4',
            '.mov',
            '.avi',
            '.mkv',
            '.flv',
            '.webm',
            '.3gp',
            '.mpeg',
            '.mpg',
            '.m4v',
            '.wmv',
            '.vob',
            '.ogv',
            '.h264',
            '.hevc',
        ],
        icon: FileVideo2,
    },

    /** Image files */
    image: {
        mime: ['image/*'],
        extensions: [
            '.jpg',
            '.jpeg',
            '.png',
            '.gif',
            '.webp',
            '.svg',
            '.bmp',
            '.tiff',
            '.heic',
            '.raw',
            '.ico',
            '.xcf',
            '.kra',
            '.clip',
            '.ase',
            '.afphoto',
        ],
        icon: FileImage,
    },

    /** Office documents */
    document: {
        mime: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.oasis.opendocument.text',
            'application/vnd.apple.pages',
        ],
        extensions: [
            '.pdf',
            '.doc',
            '.docx',
            '.odt',
            '.rtf',
            '.pages',
            '.epub',
            '.chm',
            '.djvu',
            '.mobi',
        ],
        icon: BookText,
    },

    torrent: {
        mime: ['application/x-bittorrent'],
        extensions: ['.torrent'],
        icon: FileDown,
    },

    package: {
        mime: ['application/x-apple-diskimage', 'application/x-iso9660-image'],
        extensions: ['.dmg', '.iso', '.img', '.pkg', '.snap', '.flatpak'],
        icon: FileBox,
    },

    design: {
        mime: [
            'application/vnd.adobe.photoshop',
            'image/x-xcf',
            'application/postscript',
            'image/svg+xml',
        ],
        extensions: [
            '.ai',
            '.xd',
            '.sketch',
            '.fig',
            '.eps',
            '.afdesign',
            '.cdr',
            '.skp',
            '.psd',
            '.dwg',
            '.blend',
            '.3ds',
            '.max',
            '.mb',
            '.ma',
            '.obj',
            '.stl',
        ],
        icon: PaintbrushVertical,
    },

    /** Compressed archives */
    archive: {
        mime: ['application/zip', 'application/x-rar-compressed'],
        extensions: ['.zip', '.rar', '.7z', '.tar.gz', '.bz2'],
        icon: FileArchive,
    },

    /** Executable binaries */
    executable: {
        mime: [
            'application/x-msdownload',
            'application/x-sh',
            'application/x-executable',
            'application/vnd.android.package-archive',
            'application/x-deb',
            'application/x-redhat-package-manager',
        ],
        extensions: [
            '.exe',
            '.app',
            '.jar',
            '.dmg',
            '.apk',
            '.deb',
            '.rpm',
            '.msi',
            '.run',
        ],
        icon: FileDigit,
    },

    /** Configuration files */
    config: {
        mime: [
            'application/x-yaml',
            'application/x-toml',
            'application/x-env',
            'application/json',
        ],
        extensions: [
            '.yaml',
            '.yml',
            '.toml',
            '.env',
            '.properties',
            '.cfg',
            '.conf',
            '.ini',
            '.prettierrc',
            '.eslintrc',
            '.babelrc',
            '.npmrc',
            '.editorconfig',
            '.gitattributes',
            '.htaccess',
            '.env.local',
            '.env.production',
        ],
        icon: FileCog,
    },

    /** Fallback for unknown types */
    default: {
        icon: File,
    },
} as const;

export type FileIconType = keyof typeof FILE_ICON_CONFIG;

export const SPECIAL_FILES: Record<string, FileIconType> = {
    dockerfile: 'code',
    makefile: 'code',
    gemfile: 'code',
    procfile: 'code',
    vagrantfile: 'code',
    'cmakelists.txt': 'code',
    'build.gradle': 'code',
    'pom.xml': 'code',
    'gruntfile.js': 'code',
    'gulpfile.js': 'code',
    'webpack.config.js': 'code',
    jenkinsfile: 'code',
    'bitbucket-pipelines.yml': 'config',
    '.gitignore': 'config',
    '.npmignore': 'config',
    license: 'text',
    readme: 'text',
    changelog: 'text',
};
