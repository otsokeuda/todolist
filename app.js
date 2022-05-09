const express = require("express");
const cors = require("cors");
const AppError = require("./utils/appError");
const errorHandler = require("./utils/errorHandler");
const bodyParser = require('body-parser');
const app = express();
app.use(express.urlencoded());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
var jsonParser = bodyParser.json()
const conn = require("./services/db");
app.get('/', (req, res, next) => {
    conn.query("SELECT * FROM todolist", function (err, data, fields) {
        if(err) return next(new AppError(err))
        res.status(200).json({
        status: "success",
        length: data?.length,
        data: data,
        });
      });
});
app.post('/', jsonParser, (req, res, next) => {
    if (!req.body) return next(new AppError("No form data found", 404));
    const values = [req.body.name, "pending"];
    conn.query(
        "INSERT INTO todolist (name, status) VALUES(?)",
        [values],
        function (err, data, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(201).json({
            status: "success",
            message: "todo created!",
            });
        }
    );
});
app.put('/:id',(req, res, next) => {
    if (!req.params.id) {
        return next(new AppError("No todo id found", 404));
    }
    conn.query(
        "UPDATE todolist SET status='completed' WHERE id=?",
        [req.params.id],
        function (err, data, fields) {
        if (err) return next(new AppError(err, 500));
        res.status(201).json({
            status: "success",
            message: "todo updated!",
        });
        }
    );
});
app.delete('/:id',(req, res, next) => {
    if (!req.params.id) {
        return next(new AppError("No todo id found", 404));
    }
    conn.query(
        "DELETE FROM todolist WHERE id=?",
        [req.params.id],
        function (err, fields) {
        if (err) return next(new AppError(err, 500));
        res.status(201).json({
            status: "success",
            message: "todo deleted!",
        });
        }
    );
});
app.use(errorHandler);
const PORT = 3000;
app.listen(PORT, () => {
 console.log(`server running on port ${PORT}`);
});
module.exports = app;