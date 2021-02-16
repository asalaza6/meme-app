const DEVELOPMENT = false;
//to run image location run the following the src/images folder
//python3 -m http.server 8000
const configs = {
    dev: DEVELOPMENT,
    images: {
        location:DEVELOPMENT?"src/images/":"/var/www/memechampion.com/images/"
    },
}

module.exports=configs;
