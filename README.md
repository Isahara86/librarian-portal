1. Book list 
2. Book details for admin
3. Book details for customer
4. Book reservation for admin
5. Book reservation for customer
6. Add book images gallery
7. Добавить подрезку фото
8. Добавить миниатюры для фото
   8.1 Convert images once it appear and store in jpeg(optimized), jpeg_thumbnail (?? if this required), webp, webp_thumbnail.
   8.2 Solution example
```html
<picture>
  <source srcset="img/awesomeWebPImage.webp" type="image/webp">
  <source srcset="img/creakyOldJPEG.jpg" type="image/jpeg"> 
  <img src="img/creakyOldJPEG.jpg" alt="Alt Text!">
</picture>
```
   8.3 Solution example
```javascript
const path = require('path')
const AWS = require('aws-sdk')

const S3 = new AWS.S3({
  signatureVersion: 'v4',
})

/*** IMPORTANT ***/
/*
1. This is CloudFront Edge Lambda which CANNOT have environment variables.
2. The sharp package must be linux package in order for CloudFront to run. Thus it is lived in the repo.
*/
const Sharp = require('sharp');
const BUCKET = '<your-s3-bucket-name>'; // Change to your s3 bucket
const QUALITY = 70; // adjust webp quality

function getQueryVariable(variable, query) {
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
  var pair = vars[i].split('=');
  if (decodeURIComponent(pair[0]) == variable) {
    return decodeURIComponent(pair[1]);
  }
  }  
}

async function getS3Resource(key) {
  try {
  const resource = await S3.getObject({ Bucket: BUCKET, Key: key }).promise()
  return resource;
  } catch (error) {
  if (error.code !== 'NoSuchKey') {
    console.error(error);
  }
  }
  return null;
}

exports.handler = async (event, context, callback) => {
  const { request, response } = event.Records[0].cf;
  const { uri } = request;
  const headers = response.headers;  

  const format = getQueryVariable('format', request.querystring);

  if (path.extname(uri).match(/(\.webp)$/g) && format === 'webp') {  
  if (response.status === "403" || response.status === "404") {
    // handle s3 path. E.g. "/folder/file%201.jpg.webp" to "folder/file 1.jpg.webp"
    const webpS3Key = uri.substring(1).replace(/%20/g, ' ');
    const s3key = webpS3Key.replace(/(\.webp)$/g, '');

    let sharpImageBuffer = null;

    try {
    const resource = await getS3Resource(s3key);
    if (resource) {
      sharpImageBuffer = await Sharp(resource.Body)
      .webp({ quality: +QUALITY })
      .toBuffer();

      await S3.putObject({
      Body: sharpImageBuffer,
      Bucket: BUCKET,
      ContentType: 'image/webp',
      CacheControl: 'max-age=31536000',
      Key: webpS3Key,
      StorageClass: 'STANDARD',
      ACL: 'public-read'
      }).promise();
    }

    if (sharpImageBuffer) {
      response.status = 200
      response.body = sharpImageBuffer.toString('base64')
      response.bodyEncoding = 'base64'
      response.headers['content-type'] = [{ key: 'Content-Type', value: 'image/webp' }]
      response.headers['cache-control'] = [{ key: 'Cache-Control', value: 'max-age=31536000' }]
    }

    } catch (error) {
    console.log(error);
    }
  }
  }

  callback(null, response)
}
```
