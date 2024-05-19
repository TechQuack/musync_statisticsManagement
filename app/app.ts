import StatisticsController from "./routes/statisticsController";

const express = require("express");
const app = express();
const createError = require("http-errors");
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require("morgan");

type Request = InstanceType<typeof express>;
type Response = InstanceType<typeof express>;
type NextFunction = InstanceType<typeof express>;


const statisticsController = new StatisticsController().router

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', statisticsController);

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: any , req: Request, res: Response) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000);