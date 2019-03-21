var path = require("path");

module.exports = {
    entry: {
        app: "./src/sample/index",
        vrm: "./src/ts-vrm/index",
        anime: "./src/sample/anime",
        sample: "./src/sample/sample"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },
    devtool: "inline-source-map"
};
