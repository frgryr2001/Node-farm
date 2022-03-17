const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate.js');
const slugify = require('slugify');
// Blocking synchronous
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `this is what we know about avocado: ${textIn}.\n Created on ${new Date(
//   1644225846193
// )}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File has been written");

// Non-blocking asynchronous
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("Error", err);
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile(`./txt/final.txt`, `${data2}\n${data3}`, "utf-8", (err) => {
//         // console.log(err);
//         console.log("Final");
//       });
//     });
//   });
// });
// console.log("File has been written");
//SErVER

const temOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const temProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const temCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
// console.log(data);
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === '/' || pathname === '/overview') {
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(temCard, el))
      .join('');
    const output = temOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.writeHead(200, {
      'content-type': 'text/html',
    });
    res.end(output);
  } else if (pathname === '/product') {
    const product = dataObj[query.id];
    const output = replaceTemplate(temProduct, product);
    res.writeHead(200, {
      'content-type': 'text/html',
    });
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'content-type': 'application/json',
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
