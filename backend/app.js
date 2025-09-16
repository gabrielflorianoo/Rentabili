import createError from "http-errors";
import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";

const app = express();

// Middlewares
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

// Rotas

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server is running on port 3000");
});
