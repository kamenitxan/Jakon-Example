// See http://brunch.io for documentation.
exports.paths = {
    watched: ['src/frontend'],
    public: 'static/docs'
};

exports.files = {
    javascripts: {
        joinTo: {
            'js/vendor.js': /^node_modules/, // Files that are not in `app` dir.
            'js/docs.js': /^src\/frontend\/docs\/js/
        }
    },
    stylesheets: {
        joinTo: {
            'css/vendor.css': /^node_modules/,
            'css/docs.css': /^src\/frontend\/docs\/css/
        }
    },


};

exports.plugins = {
    babel: {presets: ['latest']}
};

exports.npm = {
    enabled: true,
    globals: {
        jQuery: 'jquery',
        $: 'jquery',
        // bootstrap: 'bootstrap'
    },
    styles: {
        bootstrap: ['dist/css/bootstrap.css']
    }
};

exports.modules = {
    nameCleaner(path) {
        return path
        // Strip app/ and app/externals/ prefixes
            .replace(/^app\/(?:externals\/)?/, '')
            // Allow -x.y[.z…] version suffixes in mantisses
            .replace("src/frontend/docs/js/", '')
    }
};

