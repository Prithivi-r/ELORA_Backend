const https = require('https');
const http = require('http');

function testImageUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.get(url, (res) => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Content-Type: ${res.headers['content-type']}`);
      console.log(`Content-Length: ${res.headers['content-length']}`);
      
      if (res.statusCode === 200 && res.headers['content-type']?.startsWith('image/')) {
        resolve({
          success: true,
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          contentLength: res.headers['content-length']
        });
      } else {
        resolve({
          success: false,
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          error: 'Invalid image or status code'
        });
      }
    });
    
    req.on('error', (error) => {
      reject({
        success: false,
        error: error.message
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject({
        success: false,
        error: 'Request timeout'
      });
    });
  });
}

// Test the specific image URL
const imageUrl = 'https://cdn.riah.ae/storage/upload/images/2023/12/02/656b635ad6b17.jpg';

console.log('Testing image URL:', imageUrl);
console.log('='.repeat(50));

testImageUrl(imageUrl)
  .then(result => {
    console.log('✅ Test Result:', result);
    if (result.success) {
      console.log('🎉 Image URL is valid and accessible!');
    } else {
      console.log('❌ Image URL has issues:', result.error);
    }
  })
  .catch(error => {
    console.log('❌ Test Failed:', error);
  });