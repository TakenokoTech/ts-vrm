var path = require("path");

var development = {
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

var production = {
    mode: "production",
    entry: {
        vrm: "./src/ts-vrm/index"
    },
    output: {
        path: path.resolve(__dirname, "build"),
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
    }
};

if ((process.env.NODE_ENV || "").trim() != "production") {
    console.log("NODE_ENV", "development");
    module.exports = development;
} else {
    console.log("NODE_ENV", "production");
    module.exports = production;
}
