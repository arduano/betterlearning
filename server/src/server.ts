import express from 'express';

const app = express();
const port = 8080;

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/', (req, res) => {
    res.send('h');
});

app.get('/course/:id', (req, res) => {
    console.log('class id:', req.params.id);


    let course = {
        courseName: 'Test Course',
        pages: [
            { name: 'Red', url: '/hsl/10/90/50' },
            { name: 'Green', url: '/hsl/120/100/40' },
            { name: 'Blue', url: '/rgb/33/150/243' },
            {
                name: 'Link Folder', pages: [
                    { name: 'Red', url: '/hsl/10/90/50' },
                    { name: 'Green', url: '/hsl/120/100/40' },
                    { name: 'Blue', url: '/rgb/33/150/243' },
                    { name: 'Pink', url: '/rgb/240/98/146' },
                    { name: 'Long Page', url: '/longpage' }
                ]
            },
            { name: 'Pink', url: '/rgb/240/98/146' },
        ]
    };

    res.status(200).send(course);
});

app.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${port}`);
});