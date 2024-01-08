const fs = require('fs');
const http = require("http");
const { dirname } = require('path');
const url = require("url");

const slugify = require("slugify");
const replaceTemplate = require('./starter/modules/replaceTemplate');

////////////////////////////////////////////////
// FILE
//Blocking, synchronous way
// const hello = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// console.log(hello);
// const textOut = `This is what we know about the avocado: ${hello}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./starter/txt/output.txt', textOut);
// console.log('File written!');

// Non-blocking asynchronous way
// fs.readFile('./starter/txt/start.txt', 'utf-8', (err, data1) => {
//     if(err) return console.log("There is an error!")
//     fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile(`./starter/txt/append.txt`, 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./starter/txt/final.txt', `${data2}\n${data3}`, err => {
//                 console.log("Your file has been written! 😄");
//             })
//         });
//     });
// });

// console.log("Read first");

///////////////////////////////////////////
// SERVER

const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, {lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
    
    const { query, pathname } = url.parse(req.url, true);

    //Overview
    if (pathname === "/" || pathname === '/overview'){
        res.writeHead(200, {"Content-type": "text/html"});
        const cardHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
        res.end(output);

    // Product
    } else if (pathname === "/product"){
        res.writeHead(200, {"Content-type": "text/html"});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    


    // API
    } else if (pathname === "/api") {
        res.writeHead(200, {"Content-type": "application/json"});
        res.end(data);
    } else{
        res.writeHead(404, {
            "Content-type": "text/html",
            "my-own-header": "hello world"
        });
        res.end("<h1>Page not found</h1>");
    }

});

server.listen(8000, "127.0.0.1", () => {
    console.log("Listening to request on port 8000");
});