const DEVELOPMENT = false;
//to run image location run the following the src/images folder
//python3 -m http.server 8000
const configs = {
    dev: DEVELOPMENT,
    images: {
        postLocation:DEVELOPMENT?"src/images/posts/":"/var/www/memechampion.com/images/posts/",
        profileLocation:DEVELOPMENT?"src/images/profiles/":"/var/www/memechampion.com/images/profiles/"
    },
}

module.exports=configs;
