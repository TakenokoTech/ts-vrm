var path = require("path");

module.exports = {
    entry: {
        app: "./src/index",
        sample: "./src/vrm/sample",
        aaa: "./src/aaa",
        "react-vrm": "./react-vrm/index"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
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
