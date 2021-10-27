const gulp = require("gulp");
const webpack = require("webpack-stream");

gulp.task("default", () =>
  gulp
    .src("src/index.js")
    .pipe(
      webpack({
        entry: ["./src/index.js"],
        mode: "production",
        output: {
          filename: "reaper.js",
        },
        module: {
          rules: [
            {
              test: /\.js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: [
                    [
                      "@babel/preset-env",
                      {
                        targets: {
                          ie: "11",
                        },
                      },
                    ],
                  ],
                },
              },
            },
          ],
        },
      })
    )
    .pipe(gulp.dest("dist"))
);
