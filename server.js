let express     = require('express'),
    app         = express(),
    path        = require('path'),
    session     = require('express-session'),
    body_parser = require('body-parser'),
    mongoose    = require('mongoose');

app.use(body_parser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));
app.use(session({
    secret: '^P%mUWCwF4hWAhtgUb8BrRqWPuR$%4w^@FSB3j*VfumMEJB8SPpr57%aqRmsEyHGhJKcvgu9#W&5ZvUrCZ*q4c%8^A9RJ49@Mf3X',
    proxy: true,
    resave: false,
    saveUninitialized: true
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/cats', function() {
    console.log(mongoose.connection.readyState + ' ' + "1 = connected");
});
mongoose.Promise = global.Promise;
var CatSchema = new mongoose.Schema({
    name: {type: String, required: true},
    age: {type: Number, required: true},
    breed: {type: String, required: true},
    personality: {type: String},
    created : {type : Date, default : Date.now}
});
mongoose.model('Cat', CatSchema);
var Cat = mongoose.model('Cat');

app.get('/', (req, res) => {
    Cat.find({}, function(err, cats){
        if (err) {
            console.log('There are errors');
        } else {
            res.render('index', {cat: cats});
            }
    });
});

app.get('/cats/:id', (req,res) =>{
    this_cat = Cat.findOne({_id: req.params.id}, function(err, cat){
        if(err){
            console.log('There are errors');
        }
        else{
            res.render('cat_id', { cat:cat });
        }
    });
});

app.get('/new/cats', (req,res) =>{
    res.render('cat_new');
});

app.get('/cats/edit/:id', (req,res) =>{
    Cat.findOne({_id: req.params.id}, function(err, cat){
        if(err){
            console.log('There are errors');
        }
        else{
            res.render('cat_edit', { cat:cat });
        }
    });
});

app.post('/new/cats', (req,res) => {
    var cat = new Cat(req.body);
    cat.save(function(error, cat){
        if(error){
            console.log('error')
            res.render('cat_new', error)
        }
        else{
            res.redirect('/')
        }
    });
});

app.post('/cats/edit/:id', (req,res) =>{
    Cat.findOne({_id: req.params.id}, function(err, cat){
        cat.name = req.body.name;
        cat.age = req.body.age;
        cat.breed = req.body.breed;
        cat.personality = req.body.personality;
        cat.save(function(err){
            if(err){
                console.log('There are errors');
            }
            else{
                res.redirect('/');
            }
    });
});
});

app.post('/cats/delete/:id', (req, res) =>{
    Cat.remove({_id: req.params.id}, function(err, cat){
        if(err){
            console.log('There are errors');
        }
        else{
            res.redirect('/');
        }
    });
});

let server = app.listen(6789, () => {
    console.log("listening on port 6789");
});


